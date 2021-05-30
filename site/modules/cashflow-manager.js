/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

import * as constant from "./constant";
import * as global from "./global";
import * as chartUtility from "./chart-utility";
import * as eventHelper from "./event-helper";
import * as updater from "./updater";
import * as toaster from "./toaster";

import { ModalDialog } from "./modal-dialog";
import { ValueBtnRenderer } from "./value-btn";

const { Engine } = wasm_bindgen;

/**
 * Cashflow manager class.
 */
export class CashflowManager {

    constructor() {

        this.engine = new Engine();
        this.initialized = false;
        this.enterKeySeen = false;
    
        this.tabs = [];
        this.activeTabIndex = -1;

        this.modalDialog = new ModalDialog();
                                        
        let queryParams = new URLSearchParams(window.location.search);
        let clearLists = queryParams.has("clear");
        let locales = queryParams.getAll("locale");
        let urls = queryParams.getAll("url");

        if (locales.length === 0) {
            locales = navigator.languages.slice();
        }

        locales.push(constant.defaultLocaleStr);

        this.initLocale(clearLists, locales, urls);
    }    

    /**
     * Fetch and deserialize the next locale in the list (if present).
     * @param {array} clearLists Clear cashflows and templates.
     * @param {array} locales Locales string array.
     * @param {array} urls Urls array.
     */    
     initLocale(clearLists, locales, urls) {

        let localeStr = locales.shift();
        if (!localeStr) {
            toaster.toastError(updater.getResource(this, constant.MSG_LOCALES_LOAD));
            return;
        }

        let url = constant.localeFolder + localeStr + constant.localePreferences;        
        fetch(url).then(response => {
            if (!response.ok) {
                this.initLocale(clearLists, locales, urls);
                return;
            }

            response.text().then(text => {
                let result = this.engine.deserialize(text);
                if (result.length > 0) {
                    toaster.toastError(result);
                    return;
                }  

                let url = constant.localeFolder + localeStr + constant.localeLocales;        
                fetch(url).then(response => {
                    if (!response.ok) {
                        toaster.toastError(updater.getResource(this, constant.MSG_LOCALES_LOAD));
                        return;
                    }
            
                    response.text().then(text => {
                        let result = this.engine.deserialize(text);
                        if (result.length > 0) {
                            toaster.toastError(result);
                            return;
                        }  

                        let url = constant.localeFolder + localeStr + constant.localeTemplates;        
                        fetch(url).then(response => {
                            if (!response.ok) {
                                toaster.toastError(updater.getResource(this, constant.MSG_TEMPLATES_LOAD));
                                return;
                            }
        
                            response.text().then(text => {
                                let result = this.engine.deserialize(text);
                                if (result.length > 0) {
                                    toaster.toastError(result);
                                    return;
                                }  

                                let url = constant.localeFolder + localeStr + constant.localeHelpContext;
                                fetch(url).then(response => {
                                    if (!response.ok) {
                                        toaster.toastError(updater.getResource(this, constant.MSG_HELP_LOAD));
                                        return;
                                    }
                                    
                                    response.text().then(text => {                                                                
                                        global.config.helpForms = JSON.parse(text);

                                        if (clearLists) {
                                            this.engine.clear_lists();
                                        }

                                        this.initUrls(localeStr, urls);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }

    /**
     * Initialize additional urls.
     * @param {string} localeStr Locale string.
     * @param {array} urls Additional urls.
     */    
    initUrls(localeStr, urls) {
        let url = urls.shift();
        if (!url) {
            this.initEngine(localeStr);
            return;
        }

        fetch(url).then(response => {
            if (!response.ok) {
                toaster.toastError(updater.getResource(this, constant.MSG_TEMPLATES_LOAD));
                this.initEngine(localeStr);
                return;
            }
            
            response.text().then(text => {                                                                
                let result = this.engine.deserialize(text);
                if (result.length > 0) {
                    toaster.toastError(result);
                    this.initEngine(localeStr);
                    return;
                }  

                this.initUrls(localeStr, urls);
            });
        });
    }

    /**
     * Initialize the AmFn engine.
     * @param {string} localeStr Locale string.
     */    
    initEngine(localeStr) {
        let initInfo =  this.engine.init_engine().split('|');
        if (initInfo.length === 3) {    
            global.config.localeStr = initInfo[0];                
            global.config.encoding = initInfo[1];                
            global.config.decimalDigits = parseInt(initInfo[2]);

            global.config.helpTitleInfo = updater.getResource(this, constant.HELP_TITLE_INFO);
            global.config.helpTitleError = updater.getResource(this, constant.HELP_TITLE_ERROR);

            let tutorialLoan = document.getElementById("tutorialLoan");
            tutorialLoan.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_LOAN);
            tutorialLoan.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialLoan);

            let tutorialLoan2 = document.getElementById("tutorialLoan2");
            tutorialLoan2.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_LOAN);
            tutorialLoan2.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialLoan);

            let tutorialAnnuity = document.getElementById("tutorialAnnuity");
            tutorialAnnuity.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_ANNUITY);
            tutorialAnnuity.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialAnnuity);

            let tutorialAnnuity2 = document.getElementById("tutorialAnnuity2");
            tutorialAnnuity2.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_ANNUITY);
            tutorialAnnuity2.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialAnnuity);

            let tutorialBond = document.getElementById("tutorialBond");
            tutorialBond.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_BOND);
            tutorialBond.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialBond);

            let tutorialBond2 = document.getElementById("tutorialBond2");
            tutorialBond2.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_BOND);
            tutorialBond2.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialBond);

            let tutorialInvestment = document.getElementById("tutorialInvestment");
            tutorialInvestment.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_INVESTMENT);
            tutorialInvestment.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialInvestment);

            let tutorialInvestment2 = document.getElementById("tutorialInvestment2");
            tutorialInvestment2.innerHTML += " " + updater.getResource(this, constant.TUTORIAL_INVESTMENT);
            tutorialInvestment2.setAttribute("href", constant.localeFolder + localeStr + constant.localeTutorialInvestment);

            let helpConcepts = document.getElementById("helpConcepts");
            helpConcepts.innerHTML += " " + updater.getResource(this, constant.HELP_CONCEPTS);
            helpConcepts.setAttribute("href", constant.localeFolder + localeStr + constant.localeHelpConcepts);

            let helpConcepts2 = document.getElementById("helpConcepts2");
            helpConcepts2.innerHTML += " " + updater.getResource(this, constant.HELP_CONCEPTS);
            helpConcepts2.setAttribute("href", constant.localeFolder + localeStr + constant.localeHelpConcepts);
        
            let helpCashflow = document.getElementById("helpCashflow");
            helpCashflow.innerHTML += " " + updater.getResource(this, constant.HELP_CASHFLOW);
            helpCashflow.setAttribute("href", constant.localeFolder + localeStr + constant.localeHelpCashflow);

            let helpCashflow2 = document.getElementById("helpCashflow2");
            helpCashflow2.innerHTML += " " + updater.getResource(this, constant.HELP_CASHFLOW);
            helpCashflow2.setAttribute("href", constant.localeFolder + localeStr + constant.localeHelpCashflow);
                                                                                
            this.loadMainResources();

            window.addEventListener("beforeunload", function (e) {
                let savePending = false;
                for (let tab of this.tabs) {
                    if (tab.savePending) {
                        savePending = true;
                        break;
                    }
                }

                if (!savePending) return;

                e.preventDefault();
                return e.returnValue = "";
            });
                    
            toaster.toastInfo(updater.getResource(this, constant.MSG_INITIALIZED) + global.config.localeStr);
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
    
        this.modalDialog.showDescriptors(self, rowIndex, gridType);
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
    
        if (gridType === constant.TABLE_EVENT) {
            this.modalDialog.showExtension(self, rowIndex, constant.TABLE_EVENT,
                {
                    textCancel: updater.getResource(self, constant.MODAL_CANCEL),
                    textOK: updater.getResource(self, constant.MODAL_SUBMIT),
                    outputFn: (isOK) => {
                        if (!isOK) return {};        
                        return this.modalDialog.extensionOutput(self, rowIndex);
                    },        
                    finalFn: (isOK, data) => {
                        if (!isOK) return;
                        this.modalDialog.extensionFinal(self, rowIndex, data);
                        updater.focusEventGrid(tab);                        
                    }
                }
            );
            return;
        }

        this.modalDialog.showExtension(self, rowIndex, constant.TABLE_AM);
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
    
        this.modalDialog.showParameters(self, rowIndex, gridType);
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
    
        this.modalDialog.showSkipPeriods(self, rowIndex, gridType);
        updater.focusEventGrid(tab);
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
            toaster.toastError(updater.getResource(this, constant.MSG_TAB_INDEX) + index);
            return;
        }
    
        this.activeTabIndex = index;
        let tab = this.tabs[this.activeTabIndex];

        this.setExpand(tab.expanded);
    
        let chartDefHtml = "";
        for (let chartDef of tab.chartDefs) {  
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
    
        tab.grdEvent.classList.remove("display-none");
        tab.grdAm.classList.remove("display-none");
    
        updater.refreshStatusLine(this);  

        let enable = !!tab.lastFocused.colDef;
        let enableCalc = false;
        
        if (enable) {
            let field = tab.lastFocused.colDef.col_name;
            enableCalc = field === constant.FIELD_VALUE || field === constant.FIELD_PERIODS;
        }

        this.enableClass("btnDelete", "disabled", enable);    
        this.enableClass("btnCalculate", "disabled", enable && enableCalc);    
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
     * @param {string} status The status expression.
     * @param {string} chartDefs The chart definitions.
     */    
     addTab(cfName, cfGroup, cfLabel, divTab, grdEvent, eventColumns, 
        eventValues, grdAm, amColumns, amValues, status, chartDefs) {
    
        let eventElem = JSON.parse(eventValues);
        let amElem = JSON.parse(amValues);

        let freqMap = {
            [updater.getResource(this, constant.FREQ_1_YEAR)]: "1-year",
            [updater.getResource(this, constant.FREQ_6_MONTHS)]: "6-months",
            [updater.getResource(this, constant.FREQ_4_MONTHS)]: "4-months",
            [updater.getResource(this, constant.FREQ_3_MONTHS)]: "3-months",
            [updater.getResource(this, constant.FREQ_2_MONTHS)]: "2-months",
            [updater.getResource(this, constant.FREQ_1_MONTH)]: "1-month",
            [updater.getResource(this, constant.FREQ_HALF_MONTH)]: "half-month",
            [updater.getResource(this, constant.FREQ_4_WEEKS)]: "4-weeks",
            [updater.getResource(this, constant.FREQ_2_WEEKS)]: "2-weeks",
            [updater.getResource(this, constant.FREQ_1_WEEK)]: "1-week",
            [updater.getResource(this, constant.FREQ_1_DAY)]: "1-day",
            [updater.getResource(this, constant.FREQ_CONTINUOUS)]: "continuous"
        };
    
        let grdEventOptions = {
            columnDefs: this.createColumns(eventColumns, freqMap),
            rowData: eventElem,
            singleClickEdit: true,
            onCellFocused: e => eventHelper.eventCellFocused(this, e),
            onCellValueChanged: e => eventHelper.eventValueChanged(this, e)
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
            toaster.toastError(updater.getResource(this, constant.MSG_TAB_INDEX) + index);
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
            toaster.toastError(updater.getResource(this, constant.MSG_TAB_INDEX) + index);
            return;
        }

        if (this.tabs[index].savePending) {
            this.modalDialog.showConfirm(this,
                updater.getResource(this, constant.MSG_CASHFLOW_SAVE),
                eventHelper.saveCashflow, eventHelper.closeTabFn, index);
        } else {
            eventHelper.closeTabFn(this, index);
        }
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
                case constant.FIELD_TYPE:
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.eventTypeCB;
                    break;
                case constant.FIELD_FREQUENCY:
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
                case constant.FIELD_SKIP_PERIODS:
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
                case constant.FIELD_PARAMETERS:
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.parameterCB;
                    break;
                case constant.FIELD_DESCRIPTORS:
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
                    gridType: freqMap ? constant.TABLE_EVENT : constant.TABLE_AM,
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
            toaster.toastError(updater.getResource(this, constant.MSG_ENGINE));
        }
    
        return this.initialized;
    }

    /**
     * Load the last cashflow.
     * @param {string} name The name of the cashflow to load.
     */    
    loadCashflow(name) {
        let index = this.tabs.length;

        let result = this.engine.init_cashflow(index);
        if (result.length === 0) {
            toaster.toastError(updater.getResource(this, constant.MSG_CASHFLOW_LOAD));
            return;
        }
        
        let labels = result.split('|'); 
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

        let secHelp = document.getElementById("secHelp");
        if (!secHelp.classList.contains("display-none")) {
            secHelp.classList.add("display-none");
        }
    
        let divEvents = document.getElementById("divEvents"); 
        let grdEvent = document.createElement("div");
        grdEvent.setAttribute("class", "nav-item ag-theme-balham grid-container display-none");
        divEvents.appendChild(grdEvent);
    
        let divAms = document.getElementById("divAms"); 
        let grdAm = document.createElement("div");
        grdAm.setAttribute("class", "nav-item ag-theme-balham grid-container display-none");
        divAms.appendChild(grdAm);
        
        let eventColumns = this.engine.parse_columns(index, constant.TABLE_EVENT);
        let eventValues = this.engine.table_values(index, constant.TABLE_EVENT);
        let amColumns = this.engine.parse_columns(index, constant.TABLE_AM);
        let amValues = this.engine.table_values(index, constant.TABLE_AM);
    
        let chartDefs = this.engine.get_chart_definitions(index);
    
        chartUtility.loadChartDefs(chartDefs);
        
        this.addTab(name, group, label, divTab, grdEvent, eventColumns, 
            eventValues, grdAm, amColumns, amValues, status, chartDefs);   
    
        this.enableCashflowMenu(true);
    
        divTab.addEventListener("click", e => this.activateTabEvent(e));
        iPrefs.addEventListener("click", e => this.prefsTabEvent(e));
        iClose.addEventListener("click", e => this.closeTabEvent(e));

        grdEvent.addEventListener("keydown", e => eventHelper.eventKeyDown(this, e));
    
        divTab.click();
    }
    
    /**
     * Load main resources.
     */
     loadMainResources() {

        let versionWasm = this.engine.get_wasm_version();
        let versionEngine = this.engine.get_engine_version();

        let spnVersion = document.getElementById("spnVersion");
        spnVersion.innerHTML = updater.getResource(this, constant.NAV_VERSION) + 
            versionWasm + "/" + versionEngine;

        let btn = document.getElementById("btnInsert");
        btn.innerHTML += " " + updater.getResource(this, constant.BUTTON_INSERT);
        btn.title = updater.getResource(this, constant.BUTTON_INSERT2);

        btn = document.getElementById("btnDelete");
        btn.innerHTML += " " + updater.getResource(this, constant.BUTTON_DELETE);
        btn.title = updater.getResource(this, constant.BUTTON_DELETE2);

        btn = document.getElementById("btnCalculate");
        btn.innerHTML += " " + updater.getResource(this, constant.BUTTON_CALCULATE);
        btn.title = updater.getResource(this, constant.BUTTON_CALCULATE2);

        btn = document.getElementById("btnExpand");
        btn.innerHTML += " " + updater.getResource(this, constant.BUTTON_EXPAND);
        btn.title = updater.getResource(this, constant.BUTTON_EXPAND2);

        btn = document.getElementById("btnSummary");
        btn.innerHTML += " " + updater.getResource(this, constant.BUTTON_SUMMARY);
        btn.title = updater.getResource(this, constant.BUTTON_SUMMARY2);

        btn = document.getElementById("btnCharts");
        btn.innerHTML += " " + updater.getResource(this, constant.BUTTON_CHARTS);
        btn.title = updater.getResource(this, constant.BUTTON_CHARTS2);

        document.getElementById("menuNew").innerHTML += " " + updater.getResource(this, constant.MENU_NEW);
        document.getElementById("menuOpen").innerHTML += " " + updater.getResource(this, constant.MENU_OPEN);
        document.getElementById("menuClose").innerHTML += " " + updater.getResource(this, constant.MENU_CLOSE);
        document.getElementById("menuSave").innerHTML += " " + updater.getResource(this, constant.MENU_SAVE);
        document.getElementById("modalCancel").innerHTML = updater.getResource(this, constant.MODAL_CANCEL);
        document.getElementById("modalOK").innerHTML = updater.getResource(this, constant.MODAL_OK);
        document.getElementById("navFile").innerHTML += " " + updater.getResource(this, constant.NAV_FILE);
    }

    /**
     * Show the preferences for the tab that was clicked.
     * @param {object} e The click event.
     */    
     prefsTabEvent(e) {    
        e.stopPropagation();
    
        let index = this.getTabIndex(e);
        if (index < 0) {
            toaster.toastError(updater.getResource(this, constant.MSG_TAB_INDEX) + index);
            return;
        }
    
        this.modalDialog.showPreferences(this, index);
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
            btnExpand.innerHTML = `<i class="bi-arrows-collapse"></i> ` + updater.getResource(this, constant.BUTTON_COMPRESS);
            btnExpand.title = updater.getResource(this, constant.BUTTON_COMPRESS2);
            this.tabs[this.activeTabIndex].expanded = true;
        } else {
            grdAmOptions.api.setRowData(this.tabs[this.activeTabIndex].amValues.compressed);
            grdAmOptions.columnApi.setColumnVisible("Periods", true);
            btnExpand.innerHTML = `<i class="bi-arrows-expand"></i> ` + updater.getResource(this, constant.BUTTON_EXPAND);
            btnExpand.title = updater.getResource(this, constant.BUTTON_EXPAND2);
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
            toaster.toastError(updater.getResource(this, constant.MSG_CHART_DEF) + name);
            return;
        }
    
        this.modalDialog.showChart(this, chartDef);
    }
}