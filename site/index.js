/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

// AmFn Wasm - JavaScript
const { Engine } = wasm_bindgen;
// AmFn Wasm - Rust
const amfnWasmRust = "./node_modules/amfnwasm/amfnwasm_bg.wasm";

// Default locale if we cannot find an appropriate locale from navigator.languages
const defaultLocaleStr = "en-US";

// Serialize user preferences.
const JSON_SERIALIZE_PREFERENCES = 1;
/// Serialize templates.
const JSON_SERIALIZE_TEMPLATES = 2;
/// Serialize exchange rates.
const JSON_SERIALIZE_EXCHANGE_RATES = 4;
/// Serialize cashflow preferences.
const JSON_SERIALIZE_CASHFLOW_PREFERENCES = 8;
/// Serialize selected cashflow.
const JSON_SERIALIZE_CASHFLOW_SELECTED = 16;
/// Serialize cashflows with event list.
const JSON_SERIALIZE_EVENT_LIST = 32;
/// Serialize cashflows with amortization list and balance results
const JSON_SERIALIZE_AMORTIZATION_LIST = 64;
/// Serialize cashflows with amortization list (with rollup elements)
const JSON_SERIALIZE_AMORTIZATION_LIST_ROLLUPS = 128;
/// Serialize cashflows with amortization list (with rollup and detail elements)
const JSON_SERIALIZE_AMORTIZATION_LIST_DETAILS = 256;

// Cashflow manager instance
let cashflowManager = null;

/**
 * Cashflow manager class.
 */
class CashflowManager {

    constructor() {

        this.engine = new Engine();
        this.initialized = false;

        this.tabs = [];
        this.activeTabIndex = -1;
    
        this.initLocaleStrAry = navigator.languages.slice();
        this.initLocaleStrAry.push(defaultLocaleStr);

        this.initLocale();
    }    

    /**
     * Fetch and deserialize the next locale in the list (if present).
     */    
     initLocale() {

        let localeStr = this.initLocaleStrAry.shift();
        if (!localeStr) return;

        let url = defaultFolder + localeStr + defaultPreferences;        
        fetch(url).then(response => {
            if (!response.ok) {
                Toast.toastError(result);
                return;
            }

            response.text().then(text => {
                let result = this.engine.deserialize(text);
                if (result.length > 0) {
                    Toast.toastError(result);
                    return;
                }  

                let url = defaultFolder + localeStr + defaultLocales;        
                fetch(url).then(response => {
                    if (!response.ok) {
                        Toast.toastError("Cannot fetch locales");
                        return;
                    }

                    response.text().then(text => {
                        let result = this.engine.deserialize(text);
                        if (result.length > 0) {
                            Toast.toastError(result);
                            return;
                        }  

                        let url = defaultFolder + localeStr + defaultTemplates;        
                        fetch(url).then(response => {
                            if (!response.ok) {
                                Toast.toastError("Cannot fetch templates");
                                return;
                            }
        
                            response.text().then(text => {
                                let result = this.engine.deserialize(text);
                                if (result.length > 0) {
                                    Toast.toastError(result);
                                    return;
                                }  

                                let url = defaultFolder + localeStr + defaultHelpContext;
                                fetch(url).then(response => {
                                    if (!response.ok) {
                                        Toast.toastError("Cannot fetch help context");
                                        return;
                                    }
                        
                                    response.text().then(text => this.initEngine(localeStr, text));
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    /**
     * Initialize the AmFn engine.
     * @param {string} localeStr Locale string.
     * @param {string} text Text from help context fetch.
     */    
    initEngine(localeStr, text) {
        let initInfo =  this.engine.init().split('|');
        if (initInfo.length === 3) {    
            config.localeStr = initInfo[0];                
            config.encoding = initInfo[1];                
            config.decimalDigits = parseInt(initInfo[2]);

            config.helpForms = JSON.parse(text);
            config.helpTitleInfo = Updater.getResource(this, HELP_TITLE_INFO);
            config.helpTitleError = Updater.getResource(this, HELP_TITLE_ERROR);

            let helpConcepts = document.getElementById("helpConcepts");
            helpConcepts.innerHTML += " " + Updater.getResource(this, HELP_CONCEPTS);
            helpConcepts.setAttribute("href", defaultFolder + localeStr + defaultHelpConcepts);
        
            let helpCashflow = document.getElementById("helpCashflow");
            helpCashflow.innerHTML += " " + Updater.getResource(this, HELP_CASHFLOW);
            helpCashflow.setAttribute("href", defaultFolder + localeStr + defaultHelpCashflow);
                                                                                
            this.loadMainResources();
            
            Toast.toastInfo(Updater.getResource(this, MSG_INITIALIZED) + config.localeStr);
            this.initialized = true;
        }
    }
    
    /**
     * Descriptor callback.
     * @param {object} self Self object.
     * @param {number} rowIndex The row index.
     * @param {number} gridType The type of grid.
     */
    descriptorCB(self, rowIndex, gridType) {
        if (self.activeTabIndex < 0 || rowIndex < 0) return;
    
        ModalDialog.showDescriptors(self, rowIndex, gridType);
    }
    
    /**
     * Event type callback.
     * @param {object} self Self object.
     * @param {number} rowIndex The row index.
     * @param {number} gridType The type of grid.
     */
    eventTypeCB(self, rowIndex, gridType) {
        if (self.activeTabIndex < 0 || rowIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
    
        if (gridType === TABLE_EVENT) {
            ModalDialog.showExtension(self, rowIndex, TABLE_EVENT,
                {
                    textCancel: Updater.getResource(self, MODAL_CANCEL),
                    textOK: Updater.getResource(self, MODAL_SUBMIT),
                    outputFn: (isOK) => {
                        if (!isOK) return {};        
                        return ModalDialog.extensionOutput(self, rowIndex);
                    },        
                    finalFn: (isOK, data) => {
                        if (!isOK) return;
                        ModalDialog.extensionFinal(self, rowIndex, data);
                        Updater.focusEventGrid(tab);                        
                    }
                }
            );
            return;
        }

        ModalDialog.showExtension(self, rowIndex, TABLE_AM);
    }

    /**
     * Get the tab index.
     * @param {object} e Event object.
     * @return {number} The tab index.
     */    
     getTabIndex(e) {
        let target = e.target;
        let ulTabs = target;

        do {
            ulTabs = ulTabs.parentElement;            
        } while (ulTabs.parentElement && ulTabs.id != "ulTabs");

        let index = 0;
        for (let elem of ulTabs.children) {
            if (this.isTabChild(elem, target)) return index;
            ++index;
        }

        return -1;
    }

    /**
     * Determine if the target element is in the current element's hierarchy.
     * @param {object} elem Current element.
     * @param {number} target Target element.
     * @return {bool} True if found.
     */    
     isTabChild(elem, target) {
        if (elem === target) return true;

        for (let child of elem.children) {
            if (this.isTabChild(child, target)) return true;
        }

        return false;
    }
    
    /**
     * Parameter callback.
     * @param {object} self Self object.
     * @param {number} rowIndex The row index.
     * @param {number} gridType The type of grid.
     */
    parameterCB(self, rowIndex, gridType) {
        if (self.activeTabIndex < 0 || rowIndex < 0) return;
    
        ModalDialog.showParameters(self, rowIndex, gridType);
    }
    
    /**
     * Skip periods callback.
     * @param {object} self Self object.
     * @param {number} rowIndex The row index.
     * @param {number} gridType The type of grid.
     */
     skipPeriodsCB(self, rowIndex, gridType) {
        if (self.activeTabIndex < 0 || rowIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
    
        ModalDialog.showSkipPeriods(self, rowIndex, gridType);
        Updater.focusEventGrid(tab);
    }

    /**
     * Activate the tab that was clicked.
     * @param {object} e The click event.
     */    
    activateTabEvent(e) {
        e.stopPropagation();
    
        if (this.activeTabIndex >= 0) {
            let elems = document.querySelectorAll(".chart-item");
            for (let elem of elems) {
                let name = elem.getAttribute("data-name");
                elem.removeEventListener("click", e => this.showChartByName(name));
            }
        }
    
        let index = this.getTabIndex(e);    
        if (index < 0) {
            Toast.toastError(Updater.getResource(this, MSG_TAB_INDEX) + index);
            return;
        }
    
        this.activeTabIndex = index;
        this.setExpand(this.tabs[this.activeTabIndex].expanded);
    
        let chartDefHtml = "";
        for (let chartDef of this.tabs[this.activeTabIndex].chartDefs) {  
            let chartIcon = chartDef.allCashflows ? "bi-share" : "bi-graph-up";  
            chartDefHtml += `<li><a class="dropdown-item chart-item" href="#" data-name="` + 
                chartDef.name + `"><i class="` + chartIcon + `"></i> ` + chartDef.description + `</a></li>`;
        }
    
        let chartDefsBtn = document.getElementById("chartDefsBtn"); 
        chartDefsBtn.innerHTML = chartDefHtml;
    
        let elems = document.querySelectorAll(".chart-item");
        for (let elem of elems) {
            let name = elem.getAttribute("data-name");
            elem.addEventListener("click", e => this.showChartByName(name));
        }
    
        for (let tab of this.tabs) {
            if (!tab.grdEvent.classList.contains("display-none")) tab.grdEvent.classList.add("display-none");
            if (!tab.grdAm.classList.contains("display-none")) tab.grdAm.classList.add("display-none");
        }
    
        this.tabs[this.activeTabIndex].grdEvent.classList.remove("display-none");
        this.tabs[this.activeTabIndex].grdAm.classList.remove("display-none");
    
        Updater.refreshStatusLine(this);  
    }

    /**
     * Add a new tab.
     * @param {string} cfName The cashflow name.
     * @param {string} cfGroup The cashflow template group.
     * @param {string} cfLabel The cashflow label.
     * @param {string} divTab The tab's div element.
     * @param {string} grdEvent The event grid.
     * @param {string} eventColumns The event columns.
     * @param {string} eventValues The event values.
     * @param {string} grdAm The amortization grid.
     * @param {string} amColumns The amortization columns.
     * @param {string} amValues The amortization values.
     * @param {string} summary The summary elements.
     * @param {string} status The status expression.
     * @param {string} chartDefs The chart definitions.
     */    
     addTab(cfName, cfGroup, cfLabel, divTab, grdEvent, eventColumns, 
        eventValues, grdAm, amColumns, amValues, summary, status, chartDefs) {
    
        let eventElem = JSON.parse(eventValues);
        let amElem = JSON.parse(amValues);

        let freqMap = {
            [Updater.getResource(this, FREQ_1_YEAR)]: "1-year",
            [Updater.getResource(this, FREQ_6_MONTHS)]: "6-months",
            [Updater.getResource(this, FREQ_4_MONTHS)]: "4-months",
            [Updater.getResource(this, FREQ_3_MONTHS)]: "3-months",
            [Updater.getResource(this, FREQ_2_MONTHS)]: "2-months",
            [Updater.getResource(this, FREQ_1_MONTH)]: "1-month",
            [Updater.getResource(this, FREQ_HALF_MONTH)]: "half-month",
            [Updater.getResource(this, FREQ_4_WEEKS)]: "4-weeks",
            [Updater.getResource(this, FREQ_2_WEEKS)]: "2-weeks",
            [Updater.getResource(this, FREQ_1_WEEK)]: "1-week",
            [Updater.getResource(this, FREQ_1_DAY)]: "1-day",
            [Updater.getResource(this, FREQ_CONTINUOUS)]: "continuous"
        };
    
        let grdEventOptions = {
            columnDefs: this.createColumns(eventColumns, freqMap),
            rowData: eventElem,
            singleClickEdit: true,
            onCellFocused: e => EventHelper.eventCellFocused(e),
            onCellValueChanged: e => EventHelper.eventValueChanged(e)
        };
    
        let grdAmOptions = {
            columnDefs: this.createColumns(amColumns, null),
            rowData: amElem.compressed
        };
    
        this.tabs.push({
            name: cfName,
            group: cfGroup,
            label: cfLabel,
            divTab: divTab, 
            grdEvent: grdEvent,
            grdEventOptions: grdEventOptions,
            eventColumns: eventColumns,
            eventValues: eventElem,
            grdAm: grdAm,
            grdAmOptions: grdAmOptions,
            amColumns: amColumns,
            amValues: amElem,
            summary: summary,
            status: status,
            chartDefs: chartDefs,
            lastFocused: {
                colDef: null,
                column: null,
                rowIndex: -1,
                value: null
            },
            expanded: false,
            savePending: false
        });
    
        new agGrid.Grid(grdEvent, grdEventOptions);
        new agGrid.Grid(grdAm, grdAmOptions);
    }

    /**
     * Close the tab that was clicked.
     * @param {object} e The click event.
     */    
    closeTabEvent(e) {    
        e.stopPropagation();

        let index = this.getTabIndex(e);
        if (index < 0) {
            Toast.toastError(Updater.getResource(this, MSG_TAB_INDEX) + index);
            return;
        }
    
        this.closeTab(index);
    }

    /**
     * Close the indicated tab.
     * @param {number} index The tab index to close.
     */    
     closeTab(index) {

        if (index < 0 || index >= this.tabs.length) {
            Toast.toastError(Updater.getResource(this, MSG_TAB_INDEX) + index);
            return;
        }

        if (this.tabs[index].savePending) {
            ModalDialog.showConfirm(this,
                "Changes are pending; do you wish to discard the changes and close this cashflow anyway?", 
                EventHelper.closeTabFn, index);
            return;
        }

        EventHelper.closeTabFn(this, index);
    }

    /**
     * Create column definitions.
     * @param {array} columns An array of columns.
     * @param {object} freqMap Frequency map.
     * @return {array} An array of column definitions.
     */    
     createColumns(columns, freqMap) {
        let colDefs = [];
    
        for (let column of columns) {
    
            let colType = "";
            switch (column.format) {
                case 2:
                case 3:
                case 4: 
                    colType = "numericColumn";
                    break;
            }
    
            let colEditor = null;
            let colEditorParams = null;
            let colValueFormatter = null;
            let colValueParser = null;
            let colRenderer = null;
            let colCallback = null;
            let colFormatValue = null;
    
            switch (column.col_name) {
                case FIELD_TYPE:
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.eventTypeCB;
                    break;
                case FIELD_FREQUENCY:
                    if (!freqMap) break;
                    colEditor = "agSelectCellEditor";
                    colEditorParams = {
                        useFormatter: true,
                        values: [ "1-year", "6-months", "4-months", "3-months",
                        "2-months", "1-month", "half-month", "4-weeks",
                        "2-weeks", "1-week", "1-day", "continuous" ]
                    };
                    colValueFormatter = (params) => { 
                        return freqMap[params.value];
                    };
                    colValueParser = (params) => { 
                        let keys = Object.keys(freqMap);
                      
                        for (var i = 0; i < keys.length; ++i) {
                          let key = keys[i];
                      
                          if (freqMap[key] === params.newValue) {
                            return key;
                          }
                        }
                    };
                    break;
                case FIELD_SKIP_PERIODS:
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.skipPeriodsCB;
                    colFormatValue = (value) => {
                        let vlength = value.length;
                        if (vlength === 0) return "";

                        let oneBits = 0;
                        for (let index = 0; index < vlength; ++index) {
                            if (value[index] === '1') oneBits += 1;
                        }
                        
                        return oneBits + "/" + vlength;
                    };
                    break;
                case FIELD_PARAMETERS:
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.parameterCB;
                    break;
                case FIELD_DESCRIPTORS:
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.descriptorCB;
                    break;
            }
    
            colDefs.push({ 
                headerName: column.col_header, 
                field: column.col_name, 
                type: colType,
                editable: freqMap && column.col_editable,
                resizable: true,
                width: column.col_width * 2,
                cellEditor: colEditor,
                cellEditorParams: colEditorParams,
                valueFormatter: colValueFormatter,
                valueParser: colValueParser,
                cellRenderer: colRenderer,
                cellRendererParams: {
                    self: this,
                    gridType: freqMap ? TABLE_EVENT : TABLE_AM,
                    callback: colCallback,
                    formatValue: colFormatValue
                }
            });
        }
    
        return colDefs;
    }

    /**
     * Enable or disable a class name.
     * @param {string} id The id attribute.
     * @param {string} className The class name.
     * @param {bool} enable True to enable otherwise disable.
     */    
    enableClass(id, className, enable) {

        if (enable) {
            document.getElementById(id).classList.remove(className);
        } else {
            document.getElementById(id).classList.add(className);
        }
    }

    /**
     * Enable or disable the cashflow menu.
     * @param {bool} enable True to enable otherwise disable.
     */    
    enableCashflowMenu(enable) {
        
        this.enableClass("menuClose", "disabled", enable);
        this.enableClass("menuSave", "disabled", enable);
        this.enableClass("btnInsert", "disabled", enable);    
        this.enableClass("btnDelete", "disabled", false);    
        this.enableClass("btnCalculate", "disabled", false);            
        this.enableClass("btnExpand", "disabled", enable);    
        this.enableClass("btnSummary", "disabled", enable);    
        this.enableClass("btnCharts", "disabled", enable);        
    }

    /**
     * Show a toast message if the engine is not initialized.
     * @return {array} True if the engine is initialized.
     */    
    engineInitialized() {
        if (!this.initialized) {
            Toast.toastError(Updater.getResource(this, MSG_ENGINE));
        }
    
        return this.initialized;
    }

    /**
     * Load the last cashflow.
     * @param {string} name The name of the cashflow to load.
     */    
    loadCashflow(name) {
        let index = this.tabs.length;

        let labels = this.engine.init_cashflow(index).split('|'); 
        let group = labels.length > 2 ? labels[2] : "";
        
        let label = labels[0] + " [" + labels[1] + "]";

        let status = this.engine.init_cashflow_status(index);
    
        let ulTabs = document.getElementById("ulTabs"); 
        let li = document.createElement("li");
        li.setAttribute("class", "nav-item");
        li.setAttribute("role", "presentation");
        ulTabs.appendChild(li);
    
        let divTab = document.createElement("div");
        divTab.setAttribute("class", "nav-link");
        divTab.setAttribute("data-bs-toggle", "tab");
        divTab.setAttribute("role", "tab");
        divTab.style.cursor = "pointer";
        let spanLabel = document.createElement("span");
        spanLabel.innerHTML = label + " ";
        spanLabel.setAttribute("class", "tabLabel");
        divTab.appendChild(spanLabel);
        let iPrefs = document.createElement("i");
        iPrefs.style.cursor = "pointer";
        iPrefs.setAttribute("class", "bi-gear");
        divTab.appendChild(iPrefs);
        let iClose = document.createElement("i");
        iClose.style.cursor = "pointer";
        iClose.setAttribute("class", "bi-x");
        divTab.appendChild(iClose);
        li.appendChild(divTab);
    
        let divEvents = document.getElementById("divEvents"); 
        let grdEvent = document.createElement("div");
        grdEvent.setAttribute("class", "nav-item ag-theme-balham max-element display-none");
        divEvents.appendChild(grdEvent);
    
        let divAms = document.getElementById("divAms"); 
        let grdAm = document.createElement("div");
        grdAm.setAttribute("class", "nav-item ag-theme-balham max-element display-none");
        divAms.appendChild(grdAm);
        
        let eventColumns = this.engine.parse_columns(index, TABLE_EVENT);
        let eventValues = this.engine.table_values(index, TABLE_EVENT);
        let amColumns = this.engine.parse_columns(index, TABLE_AM);
        let amValues = this.engine.table_values(index, TABLE_AM);
        let summary = this.engine.parse_summary(index);
    
        let chartDefs = this.engine.get_chart_definitions(index);
    
        ChartUtility.loadChartDefs(chartDefs);
        
        this.addTab(name, group, label, divTab, grdEvent, eventColumns, 
            eventValues, grdAm, amColumns, amValues, summary, 
            status, chartDefs);   
    
        this.enableCashflowMenu(true);
    
        divTab.addEventListener("click", e => this.activateTabEvent(e));
        iPrefs.addEventListener("click", e => this.prefsTabEvent(e));
        iClose.addEventListener("click", e => this.closeTabEvent(e));

        grdEvent.addEventListener("keydown", e => EventHelper.eventKeyDown(e));
    
        divTab.click();
    }
    
    /**
     * Load main resources.
     */
     loadMainResources() {

        let versionWasm = this.engine.get_wasm_version();
        let versionEngine = this.engine.get_engine_version();

        let spnVersion = document.getElementById("spnVersion");
        spnVersion.innerHTML = Updater.getResource(this, NAV_VERSION) + 
            versionWasm + "/" + versionEngine;

        let btn = document.getElementById("btnInsert");
        btn.innerHTML += " " + Updater.getResource(this, BUTTON_INSERT);
        btn.title = Updater.getResource(this, BUTTON_INSERT2);

        btn = document.getElementById("btnDelete");
        btn.innerHTML += " " + Updater.getResource(this, BUTTON_DELETE);
        btn.title = Updater.getResource(this, BUTTON_DELETE2);

        btn = document.getElementById("btnCalculate");
        btn.innerHTML += " " + Updater.getResource(this, BUTTON_CALCULATE);
        btn.title = Updater.getResource(this, BUTTON_CALCULATE2);

        btn = document.getElementById("btnExpand");
        btn.innerHTML += " " + Updater.getResource(this, BUTTON_EXPAND);
        btn.title = Updater.getResource(this, BUTTON_EXPAND2);

        btn = document.getElementById("btnSummary");
        btn.innerHTML += " " + Updater.getResource(this, BUTTON_SUMMARY);
        btn.title = Updater.getResource(this, BUTTON_SUMMARY2);

        btn = document.getElementById("btnCharts");
        btn.innerHTML += " " + Updater.getResource(this, BUTTON_CHARTS);
        btn.title = Updater.getResource(this, BUTTON_CHARTS2);

        document.getElementById("menuNew").innerHTML += " " + Updater.getResource(this, MENU_NEW);
        document.getElementById("menuOpen").innerHTML += " " + Updater.getResource(this, MENU_OPEN);
        document.getElementById("menuBasicLoan").innerHTML += " " + Updater.getResource(this, MENU_BASIC_LOAN);
        document.getElementById("menuBiWeeklyLoan").innerHTML += " " + Updater.getResource(this, MENU_BIWEEKLY_LOAN);
        document.getElementById("menuStandardAnnuity").innerHTML += " " + Updater.getResource(this, MENU_STANDARD_ANNUITY);
        document.getElementById("menuStandardBond").innerHTML += " " + Updater.getResource(this, MENU_STANDARD_BOND);
        document.getElementById("menuStandardCashflow").innerHTML += " " + Updater.getResource(this, MENU_STANDARD_CASHFLOW);
        document.getElementById("menuStandardInvestment").innerHTML += " " + Updater.getResource(this, MENU_STANDARD_INVESTMENT);
        document.getElementById("menuStandardLoan").innerHTML += " " + Updater.getResource(this, MENU_STANDARD_LOAN);
        document.getElementById("menuClose").innerHTML += " " + Updater.getResource(this, MENU_CLOSE);
        document.getElementById("menuSave").innerHTML += " " + Updater.getResource(this, MENU_SAVE);
        document.getElementById("modalCancel").innerHTML = Updater.getResource(this, MODAL_CANCEL);
        document.getElementById("modalOK").innerHTML = Updater.getResource(this, MODAL_OK);
        document.getElementById("navFile").innerHTML += " " + Updater.getResource(this, NAV_FILE);
        document.getElementById("navExamples").innerHTML += " " + Updater.getResource(this, NAV_EXAMPLES);
    }

    /**
     * Show the preferences for the tab that was clicked.
     * @param {object} e The click event.
     */    
     prefsTabEvent(e) {    
        e.stopPropagation();
    
        let index = this.getTabIndex(e);
        if (index < 0) {
            Toast.toastError(Updater.getResource(this, MSG_TAB_INDEX) + index);
            return;
        }
    
        ModalDialog.showPreferences(this, index);
    }

    /**
     * Save the given cashflow.
     * @param {string} fileName The file name of the cashflow to save.
     * @param {string} text The serialized cashflow.
     */    
    saveCashflow(fileName, text) {
        let blob = new Blob([text], { type: "application/json" });
    
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, fileName);
            return;
        }
    
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
    
        a.click();
        a.remove();

        Updater.updateTabLabel(this, false);
    }    
        
    /**
     * Set the expand/compress state of the active cashflow.
     * @param {bool} expand True to show expanded, otherwise compressed.
     */    
     setExpand(expand) {
        if (!this.engineInitialized() || this.activeTabIndex < 0) return;
    
        let grdAmOptions = this.tabs[this.activeTabIndex].grdAmOptions;
        let btnExpand = document.getElementById("btnExpand");
    
        if (expand) {
            grdAmOptions.api.setRowData(this.tabs[this.activeTabIndex].amValues.expanded);
            grdAmOptions.columnApi.setColumnVisible("Periods", false);
            btnExpand.innerHTML = `<i class="bi-arrows-collapse"></i> ` + Updater.getResource(this, BUTTON_COMPRESS);
            btnExpand.title = Updater.getResource(this, BUTTON_COMPRESS2);
            this.tabs[this.activeTabIndex].expanded = true;
        } else {
            grdAmOptions.api.setRowData(this.tabs[this.activeTabIndex].amValues.compressed);
            grdAmOptions.columnApi.setColumnVisible("Periods", true);
            btnExpand.innerHTML = `<i class="bi-arrows-expand"></i> ` + Updater.getResource(this, BUTTON_EXPAND);
            btnExpand.title = Updater.getResource(this, BUTTON_EXPAND2);
            this.tabs[this.activeTabIndex].expanded = false;
        }
    }

    /**
     * Show the chart by name.
     * @param {string} name The chart name to show.
     */    
     showChartByName(name) {
        if (!this.engineInitialized() || this.activeTabIndex < 0) return;
    
        let chartDef = null;
        for (let cd of this.tabs[this.activeTabIndex].chartDefs) {
            if (cd.name === name) {
                chartDef = cd;
                break;
            }
        }
    
        if (!chartDef) {
            Toast.toastError(Updater.getResource(this, MSG_CHART_DEF) + name);
            return;
        }
    
        ModalDialog.showChart(this, chartDef);
    }
}

/**
 * Event helper class.
 */
class EventHelper {

    /**
     * Close the indicated tab function.
     * @param {object} self Self object.
     * @param {number} index The tab index to close.
     */    
     static closeTabFn(self, index) {
    
        if (!self.engine.remove_cashflow(index)) {
            Toast.toastError(Updater.getResource(self, MSG_TAB_INDEX) + index);
            return;
        }
    
        let lastTab = self.tabs.length < 2;
        if (lastTab) {        
            self.setExpand(false);
        }
    
        self.tabs[index].grdEvent.removeEventListener("keydown", e => EventHelper.eventKeyDown(e));

        self.tabs[index].grdEvent.remove();
        self.tabs[index].grdAm.remove();

        let iPrefs = self.tabs[index].divTab.querySelector(".bi-gear")
        iPrefs.removeEventListener("click", e => this.prefsTabEvent(e));
    
        let iClose = self.tabs[index].divTab.querySelector(".bi-x")
        iClose.removeEventListener("click", e => self.closeTabEvent(e));

        self.tabs[index].divTab.removeEventListener("click", e => self.activateTabEvent(e));
    
        let ulTabs = document.getElementById("ulTabs"); 
        ulTabs.children[index].remove();
    
        self.tabs.splice(index, 1);
    
        if (lastTab) {        
            self.enableCashflowMenu(false);
        } else {
            self.tabs[0].divTab.click();        
        }
    }
    
    /**
     * Respond to the event cell focus changing.
     * @param {object} e Change event.
     */    
     static eventCellFocused(e) {
        if (!(e.column && e.column.colDef && e.column.colDef.field)) return;        
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
        if (tab.lastFocused.colDef && 
            tab.lastFocused.column === e.column && 
            tab.lastFocused.rowIndex === e.rowIndex &&
            tab.grdEventOptions.api.getEditingCells().length > 0) return;

        tab.lastFocused.colDef = null;
        tab.lastFocused.column = e.column;
        tab.lastFocused.rowIndex = e.rowIndex;
        tab.lastFocused.value = null;
        
        let field = e.column.colDef.field;

        for (let colDef of tab.eventColumns) {
            if (field === colDef.col_name) {
                tab.lastFocused.colDef = colDef; 
                tab.lastFocused.value = tab.eventValues[
                    tab.lastFocused.rowIndex][tab.lastFocused.colDef.col_name];
                break;
            }
        }

        if (!tab.lastFocused.colDef) return;

        let enable = field === FIELD_VALUE || field === FIELD_PERIODS;

        cashflowManager.enableClass("btnDelete", "disabled", true);    
        cashflowManager.enableClass("btnCalculate", "disabled", enable);    

        if (tab.lastFocused.colDef.col_editable) {
            tab.grdEventOptions.api.stopEditing();
            tab.grdEventOptions.api.startEditingCell({
                rowIndex: tab.lastFocused.rowIndex,
                colKey: tab.lastFocused.column
            });
        }
    }
    
    /**
     * Respond to the grid event key down.
     * @param {object} e Keydown event.
     */    
    static eventKeyDown(e) {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;    

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
        if (e.keyCode !== 13 || e.shiftKey || e.ctrlKey || e.altKey || !tab.lastFocused.colDef) return;

        if (tab.lastFocused.value !== // Change event will fire next
            tab.eventValues[tab.lastFocused.rowIndex][tab.lastFocused.colDef.col_name]) return;

        Updater.focusEventGrid(tab);
        if (!tab.grdEventOptions.api.tabToNextCell()) {
            EventHelper.nextInsert();
        }
    }

    /**
     * Respond to the event grid cell value changing.
     * @param {object} e Change event.
     */    
    static eventValueChanged(e) {
        if (!cashflowManager.engineInitialized() || 
            cashflowManager.activeTabIndex < 0 || e.oldValue === e.newValue) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
        let field = e.column.colDef.field;

        let colDef = null;
        for (let cd of tab.eventColumns) {
            if (field === cd.col_name) {
                colDef = cd;
                break;
            }
        }        
        if (!colDef) return;

        let tokens = cashflowManager.engine.set_event_value(
            colDef.col_name_index, colDef.col_type, colDef.code, 
            cashflowManager.activeTabIndex, e.rowIndex, e.newValue).split('|');
        if (tokens.length !== 3) return;

        let eventDate = tokens[0];
        let sortOrder = parseInt(tokens[1]);
        let value = tokens[2];

        if (colDef.col_name === FIELD_DATE) eventDate = value;
        if (colDef.col_name === FIELD_SORT) sortOrder = value;

        if (colDef.col_name === FIELD_DATE || colDef.col_name === FIELD_SORT) {
            Updater.refreshEvents(cashflowManager, eventDate, sortOrder);
        } else {
            let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(e.rowIndex);
            gridRow.setDataValue(colDef.col_name, value);
        }

        Updater.focusEventGrid(tab); // Insure it's the same cell   
        if (e.rowIndex === tab.lastFocused.rowIndex && e.column === tab.lastFocused.column) { 
            if (!tab.grdEventOptions.api.tabToNextCell()) {
                EventHelper.nextInsert();
            }
        }

        Updater.refreshAmResults(cashflowManager);
        Updater.updateTabLabel(cashflowManager, true);
    }

    /**
     * Callback for files input.
     * @param {array} files The array of files input.
     */    
    static fileInput(files) {

        if (files.length < 1) {
            Toast.toastError(Updater.getResource(cashflowManager, MSG_SELECT_FILE));
            return;
        }
    
        let reader = new FileReader();
        let fileName = files[0];
    
        reader.onload = (e) => {   
            let result = cashflowManager.engine.deserialize(reader.result);
            if (result.length > 0) {
                Toast.toastError(result);
                return;
            }  

            cashflowManager.loadCashflow(fileName);
        };
    
        reader.readAsText(fileName, config.encoding);
    }

    /**
     * Respond to the menu user preferences event.
     */    
     static menuUserPreferences() {
        if (!cashflowManager.engineInitialized()) return;
    
        ModalDialog.showPreferences(cashflowManager, -1);
    }

    /**
     * Respond to the menu close cashflow event.
     */    
     static menuCloseCashflow() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;
    
        cashflowManager.closeTab(cashflowManager.activeTabIndex);
    }
    
    /**
     * Respond to the menu new cashflow event.
     */    
     static menuNewCashflow() {
        
        if (!cashflowManager.engineInitialized()) return;
      
        ModalDialog.showNewCashflow(cashflowManager);
    }
    
    /**
     * Respond to the menu open cashflow event.
     */    
     static menuOpenCashflow() {
        
        if (!cashflowManager.engineInitialized()) return;
      
        document.getElementById("fileInput").click();
    }
    
    /**
     * Respond to the menu examples event.
     * @param {string} url The url of the example cashflow to open.
     */    
     static menuOpenExample(url) {
        
        if (!cashflowManager.engineInitialized()) return;
    
        let parts = url.split('/');
        let name = parts[parts.length - 1];
    
        fetch(url).then(response => {
            response.text().then(text => {
                let result = cashflowManager.engine.deserialize(text);
                if (result.length > 0) {
                    Toast.toastError(result);
                    return;
                }  

                cashflowManager.loadCashflow(name);
            });
        });
    }
    
    /**
     * Respond to the menu save cashflow event.
     */    
     static menuSaveCashflow() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;
    
        let text = cashflowManager.engine.serialize(cashflowManager.activeTabIndex,
            JSON_SERIALIZE_CASHFLOW_PREFERENCES + 
            JSON_SERIALIZE_CASHFLOW_SELECTED + 
            JSON_SERIALIZE_EVENT_LIST);
    
        cashflowManager.saveCashflow(cashflowManager.tabs[cashflowManager.activeTabIndex].name, text);
    }
    
    /**
     * Respond to the menu insert event.
     */    
     static menuInsert() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];

        ModalDialog.showInsertEvent(cashflowManager);
        Updater.focusEventGrid(tab);
    }
    
    /**
     * Respond to the menu delete event.
     */    
     static menuDelete() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];

        if (cashflowManager.engine.remove_event(cashflowManager.activeTabIndex, tab.lastFocused.rowIndex)) {
            tab.grdEventOptions.rowData.splice(tab.lastFocused.rowIndex, 1);
            tab.grdEventOptions.api.setRowData(tab.grdEventOptions.rowData);

            tab.lastFocused.colDef = null;
            tab.lastFocused.column = null;
            tab.lastFocused.rowIndex = -1;
            tab.lastFocused.value = null;

            cashflowManager.enableClass("btnDelete", "disabled", false);    
            cashflowManager.enableClass("btnCalculate", "disabled", false);            

            Updater.focusEventGrid(tab);
        }
    }
    
    /**
     * Respond to the menu cashflow calculate event.
     */    
     static menuCalculate() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
        if (!tab.lastFocused.colDef) return;

        let result = null;
        switch (tab.lastFocused.colDef.col_name) {
            case FIELD_VALUE:
                result = cashflowManager.engine.calculate_value(
                    cashflowManager.activeTabIndex, tab.lastFocused.rowIndex);
                if ("interest-change" in tab.eventValues[tab.lastFocused.rowIndex].extension) {
                    result = cashflowManager.engine.format_decimal_out(result);
                } else {
                    result = cashflowManager.engine.format_currency_out(result);
                }
                break;
            case FIELD_PERIODS:
                result = cashflowManager.engine.calculate_periods(
                    cashflowManager.activeTabIndex, tab.lastFocused.rowIndex);
                result = cashflowManager.engine.format_integer_out(result);
                break;
        }

        if (!result) return;

        tab.grdEventOptions.api.stopEditing();
        let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(tab.lastFocused.rowIndex);
        gridRow.setDataValue(tab.lastFocused.colDef.col_name, result);

        Updater.refreshAmResults(cashflowManager);
        Updater.updateTabLabel(cashflowManager, true);
        Updater.focusEventGrid(tab);
    }
    
    /**
     * Respond to the menu expand cashflow event.
     */    
     static menuExpand() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;
    
        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
        
        cashflowManager.setExpand(!tab.expanded);
        Updater.focusEventGrid(tab);
    }
    
    /**
     * Respond to the menu cashflow summary event.
     */    
     static menuSummary() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;
    
        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
    
        ModalDialog.showSummary(cashflowManager);
        Updater.focusEventGrid(tab);
    }
    
    /**
     * Respond to the next insert event.
     */    
     static nextInsert() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];

        let nextName = "";
        if (tab.lastFocused.colDef) {
            nextName = tab.eventValues[tab.lastFocused.rowIndex]["Next-name"];
        }

        if (!nextName) return;
        
        Updater.createTemplateEvents(cashflowManager, nextName);
    }

    /**
     * Show/hide the spinner.
     * @param {bool} isShow Show the spinner.
     */    
    static showSpinner(isShow) {

        let divBackground = document.getElementById("divBackground");
        let divSpinner = document.getElementById("divSpinner");

        if (isShow) {
            divBackground.style.display = "block";
            divSpinner.style.display = "inline-flex";
        } else {
            divBackground.style.display = "none";
            divSpinner.style.display = "none";
        }
    }

    /**
     * Respond to the skip periods input value changing.
     * @param {object} e Input event.
     * @param {object} self Self event.
     * @param {object} skipPeriodsChangeInfo Skip periods change info.
     */  
    static skipPeriodsInput(e, self, skipPeriodsChangeInfo) {  
        skipPeriodsChangeInfo.newValue = e.target.value;
        
        let rangeValue = document.getElementById("skipPeriodsRangeValue");
        rangeValue.value = skipPeriodsChangeInfo.newValue;

        ModalDialog.showSkipPeriodsRangeChange(self, skipPeriodsChangeInfo);
    }    

    /**
     * Respond to the skip periods slider value changing.
     * @param {object} e Change event.
     * @param {object} self Self event.
     * @param {object} skipPeriodsChangeInfo Skip periods change info.
     */    
     static skipPeriodsChange(e, self, skipPeriodsChangeInfo) {
        skipPeriodsChangeInfo.newValue = e.target.value;
        
        let range = document.getElementById("skipPeriodsRange");
        range.value = skipPeriodsChangeInfo.newValue;

        ModalDialog.showSkipPeriodsRangeChange(self, skipPeriodsChangeInfo);
    }
}

/**
 * Wait for the DOM content to be loaded and initialize the app.
 */    
 document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("menuBasicLoan").addEventListener("click", () => EventHelper.menuOpenExample(defaultBasicLoanUrl));    
    document.getElementById("menuBiWeeklyLoan").addEventListener("click", () => EventHelper.menuOpenExample(defaultBiWeeklyLoanUrl));    
    document.getElementById("menuStandardAnnuity").addEventListener("click", () => EventHelper.menuOpenExample(defaultStandardAnnuityUrl));    
    document.getElementById("menuStandardBond").addEventListener("click", () => EventHelper.menuOpenExample(defaultStandardBondUrl));    
    document.getElementById("menuStandardCashflow").addEventListener("click", () => EventHelper.menuOpenExample(defaultStandardCashflowUrl));    
    document.getElementById("menuStandardInvestment").addEventListener("click", () => EventHelper.menuOpenExample(defaultStandardInvestmentUrl));    
    document.getElementById("menuStandardLoan").addEventListener("click", () => EventHelper.menuOpenExample(defaultStandardLoanUrl));    
    
    document.getElementById("menuNew").addEventListener("click", () => EventHelper.menuNewCashflow());    
    document.getElementById("menuOpen").addEventListener("click", () => EventHelper.menuOpenCashflow());    
    document.getElementById("menuClose").addEventListener("click", () => EventHelper.menuCloseCashflow());    
    document.getElementById("menuSave").addEventListener("click", () => EventHelper.menuSaveCashflow());    

    document.getElementById("btnInsert").addEventListener("click", () => EventHelper.menuInsert());
    document.getElementById("btnDelete").addEventListener("click", () => EventHelper.menuDelete());
    document.getElementById("btnCalculate").addEventListener("click", () => EventHelper.menuCalculate());

    document.getElementById("btnExpand").addEventListener("click", () => EventHelper.menuExpand());
    document.getElementById("btnSummary").addEventListener("click", () => EventHelper.menuSummary());

    document.getElementById("menuUserPreferences").addEventListener("click", () => EventHelper.menuUserPreferences()); 

    ModalDialog.modalInit();
    
    document.getElementById("fileInput").addEventListener("change", (e) => { 
        EventHelper.fileInput(e.target.files); 
        e.target.value = ""; 
    });

    /**
     * Load the AmFn Wasm and initialize the cashflow manager.
     */    
    async function runAmFnWasm() {
        await wasm_bindgen(amfnWasmRust);
        
        EventHelper.showSpinner(false);
        cashflowManager = new CashflowManager();
    }

    EventHelper.showSpinner(true);
    runAmFnWasm();

});