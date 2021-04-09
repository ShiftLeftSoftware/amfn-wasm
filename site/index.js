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

// Default locale and preference URLs
const defaultLocalesUrl = "./default/locales.json";
const defaultPreferencesUrl = "./default/preferences.json";

// Example cashflow URLs.
const defaultBasicLoanUrl = "./default/basic_loan.json";
const defaultBiWeeklyLoanUrl = "./default/bi_weekly_loan.json";
const defaultStandardAnnuityUrl = "./default/standard_annuity.json";
const defaultStandardBondUrl = "./default/standard_bond.json";
const defaultStandardCashflowUrl = "./default/standard_cashflow.json";
const defaultStandardInvestmentUrl = "./default/standard_investment.json";
const defaultStandardLoanUrl = "./default/standard_loan.json";

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

// Locales URL (can be customized)
const localesUrl = defaultLocalesUrl;
// User preferences URL (can be customized)
const preferencesUrl = defaultPreferencesUrl;

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

        this.config = {
            localeStr: "",
            encoding: "utf-8",
            decimalDigits: 2
        };
    
        this.initEnvironment(preferencesUrl, localesUrl);
    }

    /**
     * Initialize the user preferences and locales.
     * @param {string} preferencesUrl The url of the user preferences.
     * @param {string} localesUrl The url of the locales.
     */    
    initEnvironment(preferencesUrl, localesUrl) {

        fetch(preferencesUrl).then(response => {
            response.text().then(text => {
                let result = this.engine.deserialize(text);
                if (result.length > 0) {
                    Toast.toastError(result);
                    return;
                }     

                fetch(localesUrl).then(response => {
                    response.text().then(text => {
                        this.engine.deserialize(text);
                        let initInfo =  this.engine.init("").split('|');
                        if (initInfo.length === 3) {    
                            this.config.localeStr = initInfo[0];                
                            this.config.encoding = initInfo[1];                
                            this.config.decimalDigits = parseInt(initInfo[2]);                
                            Toast.toastInfo("Initialized locale: " + this.config.localeStr);
                            this.initialized = true;
                        }
                    });
                });
            });
        });
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
                    textCancel: "Cancel",
                    textOK: "Submit",
                    outputFn: (isOK) => {
                        if (isOK) ModalDialog.showExtensionOutput(self, rowIndex);
                        Updater.focusEventGrid(tab);                        
                    }
                }
            );
            return;
        }

        ModalDialog.showExtension(self, rowIndex, TABLE_AM);
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
    
        let target = e.target.parentElement;
    
        let children = target.parentElement.children;
        let index = 0;
        for (; index < children.length; index++) {
            if (children[index] === target) {
                break;
            }
        }
    
        if (index >= this.tabs.length) {
            Toast.toastError("Cannot activate tab; unknown index = " + index);
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
    
        let chartDefsMenu = document.getElementById("chartDefsMenu"); 
        chartDefsMenu.innerHTML = chartDefHtml;
    
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
     addTab(cfName, cfLabel, divTab, grdEvent, eventColumns, 
        eventValues, grdAm, amColumns, amValues, summary, status, chartDefs) {
    
        let eventElem = JSON.parse(eventValues);
        let amElem = JSON.parse(amValues);
    
        let grdEventOptions = {
            columnDefs: this.createColumns(eventColumns, true),
            rowData: eventElem,
            singleClickEdit: true,
            onCellFocused: e => EventHelper.eventCellFocused(this, e),
            onCellValueChanged: e => EventHelper.eventValueChanged(this, e)
        };
    
        let grdAmOptions = {
            columnDefs: this.createColumns(amColumns, false),
            rowData: amElem.compressed
        };
    
        this.tabs.push({
            name: cfName,
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
            lastFocusedColDef: null,
            lastFocusedColumn: null,
            lastFocusedRowIndex: 0,    
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
    
        let target = e.target.parentElement.parentElement;
    
        let children = target.parentElement.children;
        let index = 0;
        for (; index < children.length; index++) {                
            if (children[index] === target) {
                break;
            }
        }
    
        this.closeTab(index);
    }

    /**
     * Close the indicated tab.
     * @param {number} index The tab index to close.
     */    
     closeTab(index) {

        if (index < 0 || index >= this.tabs.length) {
            Toast.toastError("Cannot close tab; unknown index = " + index);
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
     * @param {bool} isEvent True if event table otherwise amortization.
     * @return {array} An array of column definitions.
     */    
     createColumns(columns, isEvent) {
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
            let colRenderer = null;
            let colCallback = null;
            let colFormatValue = null;
    
            switch (column.col_name) {
                case "Type":
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.eventTypeCB;
                    break;
                case "Frequency":
                    if (!isEvent) break;
                    colEditor = "agSelectCellEditor";
                    colEditorParams = {
                        values: [ "1-year", "6-months", "4-months", "3-months",
                            "1-months", "1-month", "half-month", "4-weeks",
                            "2-weeks", "1-week", "1-day", "continuous" ]
                    };
                    break;
                case "Skip-periods":
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
                case "Parameter-list":
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.parameterCB;
                    break;
                case "Descriptor-list":
                    colRenderer = ValueBtnRenderer;
                    colCallback = this.descriptorCB;
                    break;
            }
    
            colDefs.push({ 
                headerName: column.col_header, 
                field: column.col_name, 
                type: colType,
                editable: isEvent && column.col_editable,
                resizable: true,
                width: column.col_width * 2,
                cellEditor: colEditor,
                cellEditorParams: colEditorParams,
                cellRenderer: colRenderer,
                cellRendererParams: {
                    self: this,
                    gridType: isEvent ? TABLE_EVENT : TABLE_AM,
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
        this.enableClass("menuCashflow", "disabled", enable);
        this.enableClass("menuCalculate", "disabled", false);
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
            Toast.toastError("AmFn Engine has not been initialized");
        }
    
        return this.initialized;
    }

    /**
     * Load the given cashflow.
     * @param {string} name The name of the cashflow to load.
     * @param {string} text The serialized cashflow.
     */    
     loadCashflow(name, text) {
        let result = this.engine.deserialize(text);
        if (result.length > 0) {
            Toast.toastError(result);
            return;
        }
    
        let index = this.tabs.length;
        let label = this.engine.init_cashflow(index);    
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
        
        this.addTab(name, label, divTab, grdEvent, eventColumns, 
            eventValues, grdAm, amColumns, amValues, summary, 
            status, chartDefs);   
    
        this.enableCashflowMenu(true);
    
        divTab.addEventListener("click", e => this.activateTabEvent(e));
        iClose.addEventListener("click", e => this.closeTabEvent(e));

        grdEvent.addEventListener("keydown", e => EventHelper.eventKeyDown(this, e));
    
        divTab.click();
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
        let menuExpand = document.getElementById("menuExpand");    
        let btnExpand = document.getElementById("btnExpand");
    
        if (expand) {
            grdAmOptions.api.setRowData(this.tabs[this.activeTabIndex].amValues.expanded);
            menuExpand.innerHTML = `<i class="bi-arrows-collapse"></i> Compress Am`;
            btnExpand.innerHTML = `<i class="bi-arrows-collapse"></i> Compress`;
            this.tabs[this.activeTabIndex].expanded = true;
        } else {
            grdAmOptions.api.setRowData(this.tabs[this.activeTabIndex].amValues.compressed);
            menuExpand.innerHTML = `<i class="bi-arrows-expand"></i> Expand Am`;
            btnExpand.innerHTML = `<i class="bi-arrows-expand"></i> Expand`;
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
            Toast.toastError("Cannot find chart definition: " + name);
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
            Toast.toastError("Cannot remove cashflow; index = " + index);
            return;
        }
    
        let lastTab = self.tabs.length < 2;
        if (lastTab) {        
            self.setExpand(false);
        }
    
        self.tabs[index].grdEvent.removeEventListener("keydown", e => EventHelper.eventKeyDown(self, e));
        self.tabs[index].grdEvent.remove();
        self.tabs[index].grdAm.remove();
    
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
     * @param {object} self Self object.
     * @param {object} e Change event.
     */    
     static eventCellFocused(self, e) {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
        if (tab.lastFocusedColumn === e.column && tab.lastFocusedRowIndex === e.rowIndex) return;

        tab.lastFocusedColDef = null;
        tab.lastFocusedColumn = e.column;
        tab.lastFocusedRowIndex = e.rowIndex;
        let field = e.column.colDef.field;

        for (let colDef of tab.eventColumns) {
            if (field === colDef.col_name) {
                tab.lastFocusedColDef = colDef; 
                break;
            }
        }

        if (!tab.lastFocusedColDef) return;

        let enable = field === "Value" || field === "Periods";

        self.enableClass("menuCalculate", "disabled", enable);
        self.enableClass("btnCalculate", "disabled", enable);    

        if (tab.lastFocusedColDef.col_editable) {
            tab.grdEventOptions.api.startEditingCell({
                rowIndex: tab.lastFocusedRowIndex,
                colKey: tab.lastFocusedColumn
            });
        }
    }
    
    /**
     * Respond to the grid event key down.
     * @param {object} self Self object.
     * @param {object} e Keydown event.
     */    
     static eventKeyDown(self, e) {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;    

        if (e.keyCode !== 13 || e.shiftKey || e.ctrlKey || e.altKey) return;

        e.stopPropagation();

        let tab = self.tabs[self.activeTabIndex];

        Updater.focusEventGrid(tab);
        if (!tab.grdEventOptions.api.tabToNextCell()) {
            Toast.toastInfo("New event");
        }
    }

    /**
     * Respond to the event grid cell value changing.
     * @param {object} self Self object.
     * @param {object} e Change event.
     */    
     static eventValueChanged(self, e) {
        if (!cashflowManager.engineInitialized() || 
            cashflowManager.activeTabIndex < 0 || e.oldValue === e.newValue) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
        let field = e.column.colDef.field;
        let row = tab.eventValues[e.rowIndex];

        for (let colDef of tab.eventColumns) {
            if (field === colDef.col_name) {
                let value = cashflowManager.engine.set_event_value(
                    colDef.col_name_index, colDef.col_type, colDef.code, 
                    cashflowManager.activeTabIndex, e.rowIndex, e.newValue);
                if (value) {
                    let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(e.rowIndex);
                    gridRow.setDataValue(colDef.col_name, value);

                    Updater.refreshAmResults(self);
                    Updater.updateTabLabel(self, true);
                }
                break;
            }
        }
    }

    /**
     * Callback for files input.
     * @param {array} files The array of files input.
     */    
    static fileInput(files) {

        if (files.length < 1) {
            Toast.toastError("Please select a file...");
            return;
        }
    
        let reader = new FileReader();
        let fileName = files[0];
    
        reader.onload = (e) => {   
            cashflowManager.loadCashflow(fileName, reader.result);
        };
    
        reader.readAsText(fileName, cashflowManager.config.encoding);
    }

    /**
     * Respond to the menu close cashflow event.
     */    
     static menuCloseCashflow() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;
    
        cashflowManager.closeTab(cashflowManager.activeTabIndex);
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
                cashflowManager.loadCashflow(name, text);
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
     * Respond to the menu cashflow calculate event.
     */    
     static menuCalculate() {
        if (!cashflowManager.engineInitialized() || cashflowManager.activeTabIndex < 0) return;

        let tab = cashflowManager.tabs[cashflowManager.activeTabIndex];
        if (!tab.lastFocusedColDef) return;

        let result = null;
        switch (tab.lastFocusedColDef.col_name) {
            case "Value":
                result = cashflowManager.engine.calculate_value(
                    cashflowManager.activeTabIndex, tab.lastFocusedRowIndex, "0.0"); // ##### Split button
                if ("interest-change" in tab.eventValues[tab.lastFocusedRowIndex].extension) {
                    result = cashflowManager.engine.format_decimal_out(result);
                } else {
                    result = cashflowManager.engine.format_currency_out(result);
                }
                break;
            case "Periods":
                result = cashflowManager.engine.calculate_periods(
                    cashflowManager.activeTabIndex, tab.lastFocusedRowIndex, "0.0"); // ##### Split button
                result = cashflowManager.engine.format_integer_out(result);
                break;
        }

        if (!result) return;

        tab.grdEventOptions.api.stopEditing();
        let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(tab.lastFocusedRowIndex);
        gridRow.setDataValue(tab.lastFocusedColDef.col_name, result);

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
    
        ModalDialog.showSummary(cashflowManager.tabs[cashflowManager.activeTabIndex].summary);
        Updater.focusEventGrid(tab);
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
    
    document.getElementById("menuOpen").addEventListener("click", () => EventHelper.menuOpenCashflow());    
    document.getElementById("menuClose").addEventListener("click", () => EventHelper.menuCloseCashflow());    
    document.getElementById("menuSave").addEventListener("click", () => EventHelper.menuSaveCashflow());    

    document.getElementById("menuCalculate").addEventListener("click", () => EventHelper.menuCalculate());    
    document.getElementById("menuExpand").addEventListener("click", () => EventHelper.menuExpand());    
    document.getElementById("menuSummary").addEventListener("click", () => EventHelper.menuSummary());    

    document.getElementById("btnCalculate").addEventListener("click", () => EventHelper.menuCalculate());
    document.getElementById("btnExpand").addEventListener("click", () => EventHelper.menuExpand());
    document.getElementById("btnSummary").addEventListener("click", () => EventHelper.menuSummary());

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