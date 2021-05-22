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
const { WasmElemPreferences } = wasm_bindgen;

/// Locale file definitions
const localeFolder = "./locales/";
const localePreferences = "/preferences.json";
const localeLocales = "/locales.json";
const localeTemplates = "/templates.json";
const localeHelpContext = "/help/context.json";
const localeHelpConcepts = "/help/concepts.html";
const localeHelpCashflow = "/help/cashflow.html";
const localeTutorialLoan = "/tutorials/loan/loan.html";
const localeTutorialAnnuity = "/tutorials/annuity/annuity.html";
const localeTutorialBond = "/tutorials/bond/bond.html";
const localeTutorialInvestment = "/tutorials/investment/investment.html";

// Table type event.
const TABLE_EVENT = 0;
// Table type amortization.
const TABLE_AM = 1;

// Format - string.
const FORMAT_STRING = 0;
// Format - date.
const FORMAT_DATE = 1;
// Format - integer.
const FORMAT_INTEGER = 2;
// Format - decimal.
const FORMAT_DECIMAL = 3;
// Format - currency.
const FORMAT_CURRENCY = 4;

// Column field names
const FIELD_TYPE = "Type";
const FIELD_DATE = "Date";
const FIELD_SORT = "Sort";
const FIELD_VALUE = "Value";
const FIELD_PERIODS = "Periods";
const FIELD_FREQUENCY = "Frequency";
const FIELD_SKIP_PERIODS = "Skip-periods";
const FIELD_PARAMETERS = "Parameter-list";
const FIELD_DESCRIPTORS = "Descriptor-list";

// Resource button constants.
const BUTTON_INSERT = "Button_Insert";
const BUTTON_DELETE = "Button_Delete";
const BUTTON_CALCULATE = "Button_Calculate";
const BUTTON_EXPAND = "Button_Expand";
const BUTTON_COMPRESS = "Button_Compress";
const BUTTON_SUMMARY = "Button_Summary";
const BUTTON_CHARTS = "Button_Charts";
const BUTTON_INSERT2 = "Button_Insert2";
const BUTTON_DELETE2 = "Button_Delete2";
const BUTTON_CALCULATE2 = "Button_Calculate2";
const BUTTON_EXPAND2 = "Button_Expand2";
const BUTTON_COMPRESS2 = "Button_Compress2";
const BUTTON_SUMMARY2 = "Button_Summary2";
const BUTTON_CHARTS2 = "Button_Charts2";

// Resource compute method constants
const METHOD_ACTUARIAL = "Method_Actuarial";
const METHOD_SIMPLE_INTEREST = "Method_Simple_Interest";

// Resource day-count constants.
const DAY_COUNT_PERIODIC = "Day_Count_Basis_Periodic";
const DAY_COUNT_RULE_OF_78 = "Day_Count_Basis_Rule_Of_78";
const DAY_COUNT_ACTUAL = "Day_Count_Basis_Actual";
const DAY_COUNT_ACTUAL_ISMA = "Day_Count_Basis_Actual_Actual_ISMA";
const DAY_COUNT_ACTUAL_AFB = "Day_Count_Basis_Actual_Actual_AFB";
const DAY_COUNT_ACTUAL_365L = "Day_Count_Basis_Actual_365L";
const DAY_COUNT_30 = "Day_Count_Basis_30";
const DAY_COUNT_30E = "Day_Count_Basis_30E";
const DAY_COUNT_30EP = "Day_Count_Basis_30EP";

// Resource error constants
const ERROR_CALCULATE_INTEREST = "Error_Calculate_Interest";
const ERROR_CALCULATE_PERIODS = "Error_Calculate_Periods";
const ERROR_CALCULATE_PRINCIPAL = "Error_Calculate_Principal";

// Resource frequency constants.
const FREQ_NONE = "Frequency_None";
const FREQ_1_YEAR = "Frequency_1_Year";
const FREQ_6_MONTHS = "Frequency_6_Months";
const FREQ_4_MONTHS = "Frequency_4_Months";
const FREQ_3_MONTHS = "Frequency_3_Months";
const FREQ_2_MONTHS = "Frequency_2_Months";
const FREQ_1_MONTH = "Frequency_1_Month";
const FREQ_HALF_MONTH = "Frequency_Half_Month";
const FREQ_4_WEEKS = "Frequency_4_Weeks";
const FREQ_2_WEEKS = "Frequency_2_Weeks";
const FREQ_1_WEEK = "Frequency_1_Week";
const FREQ_1_DAY = "Frequency_1_Day";
const FREQ_CONTINUOUS = "Frequency_Continuous";

// Resource menu constants.
const MENU_NEW = "Menu_New";
const MENU_OPEN = "Menu_Open";
const MENU_CLOSE = "Menu_Close";
const MENU_SAVE = "Menu_Save";

// Resource modal constants.
const MODAL_CANCEL = "Modal_Cancel";
const MODAL_OK = "Modal_OK";
const MODAL_SUBMIT = "Modal_Submit";
const MODAL_CONFIRMATION = "Modal_Confirmation"; 
const MODAL_NO = "Modal_No"; 
const MODAL_YES = "Modal_Yes"; 

// Resource modal titles.
const MODAL_DESCRIPTOR_LIST = "Modal_Descriptor_List";
const MODAL_CURRENT_VALUE = "Modal_Current_Value";
const MODAL_INTEREST_CHANGE = "Modal_Interest_Change";
const MODAL_STATISTIC_CHANGE = "Modal_Statistic_Value";
const MODAL_PRINCIPAL_CHANGE = "Modal_Principal_Change";
const MODAL_INSERT_EVENT = "Modal_Insert_Event";
const MODAL_NEW_CASHFLOW = "Modal_New_Cashflow";
const MODAL_PARAMETER_LIST = "Modal_Parameter_List";
const MODAL_SKIP_PERIODS = "Modal_Skip_Periods";
const MODAL_CASHFLOW_SUMMARY = "Modal_Cashflow_Summary";
const MODAL_USER_PREFERENCES = "Modal_User_Preferences";
const MODAL_CASHFLOW_PREFERENCES = "Modal_Cashflow_Preferences";

// Resource modal descriptors.
const MODAL_DESC_GROUP = "Modal_Desc_Group";
const MODAL_DESC_NAME = "Modal_Desc_Name";
const MODAL_DESC_TYPE = "Modal_Desc_Type";
const MODAL_DESC_CODE = "Modal_Desc_Code";
const MODAL_DESC_VALUE = "Modal_Desc_Value";
const MODAL_DESC_PROPAGATE = "Modal_Desc_Propagate";            

// Resource modal current value.
const MODAL_CV_EOM = "Modal_Cv_Eom";
const MODAL_CV_PASSIVE = "Modal_Cv_Passive";
const MODAL_CV_PRESENT = "Modal_Cv_Present";            

// Resource modal interest change.
const MODAL_IC_METHOD = "Modal_Ic_Method";
const MODAL_IC_DAY_COUNT = "Modal_Ic_DayCount";
const MODAL_IC_DAYS_IN_YEAR = "Modal_Ic_DaysInYear";
const MODAL_IC_EFF_FREQ = "Modal_Ic_EffFreq";
const MODAL_IC_INT_FREQ = "Modal_Ic_IntFreq";
const MODAL_IC_ROUND_BAL = "Modal_Ic_RoundBal";
const MODAL_IC_ROUND_DD = "Modal_Ic_RoundDD";
const MODAL_IC_STAT_NAR = "Modal_Ic_Stat_Nar";
const MODAL_IC_STAT_EAR = "Modal_Ic_Stat_Ear";
const MODAL_IC_STAT_PR = "Modal_Ic_Stat_Pr";
const MODAL_IC_STAT_DR = "Modal_Ic_Stat_Dr";

// Resource modal principal change.
const MODAL_PC_TYPE = "Modal_Pc_Type";
const MODAL_PC_EOM = "Modal_Pc_Eom";
const MODAL_PC_PRIN_FIRST = "Modal_Pc_PrinFirst";
const MODAL_PC_BAL_STAT = "Modal_Pc_BalStat";
const MODAL_PC_AUXILIARY = "Modal_Pc_Auxiliary";
const MODAL_PC_AUX_PASSIVE = "Modal_Pc_AuxPassive";

// Resource modal statistic value.
const MODAL_SV_NAME = "Modal_Sv_Name";
const MODAL_SV_EOM = "Modal_Sv_Eom";
const MODAL_SV_FINAL = "Modal_Sv_Final";            

// Resource modal new cashflow.
const MODAL_NC_NAME = "Modal_Nc_Name";
const MODAL_NC_TEMPLATE = "Modal_Nc_Template";

// Resource modal preferences
const MODAL_PREF_LOCALE = "Modal_Pref_Locale";
const MODAL_PREF_CROSS_RATE = "Modal_Pref_Cross_Rate";
const MODAL_PREF_ENCODING = "Modal_Pref_Encoding";
const MODAL_PREF_GROUP = "Modal_Pref_Group";
const MODAL_PREF_FISCAL_YEAR = "Modal_Pref_Fiscal_Year";
const MODAL_PREF_DECIMAL_DIGITS = "Modal_Pref_Decimal_Digits";
const MODAL_PREF_TARGET_VALUE = "Modal_Pref_Target_Value";

// Resource message constants.
const MSG_INITIALIZED = "Msg_Initialized";
const MSG_SELECT_FILE = "Msg_Select_File";
const MSG_SELECT_TEMPLATE_EVENT = "Msg_Select_Template_Event";
const MSG_SELECT_CASHFLOW_TEMPLATE = "Msg_Select_Cashflow_Template";
const MSG_TAB_INDEX = "Msg_Tab_Index";
const MSG_CHART_DEF = "Msg_Chart_Def";
const MSG_ENGINE = "Msg_Engine";
const MSG_LOCALES_LOAD = "Msg_Locales_Load";
const MSG_TEMPLATES_LOAD = "Msg_Templates_Load";
const MSG_HELP_LOAD = "Msg_Help_Load";
const MSG_CASHFLOW_LOAD = "Msg_Cashflow_Load";
const MSG_CASHFLOW_SAVE = "Msg_Cashflow_Save";

// Resource navigation constants.
const NAV_FILE = "Nav_File";
const NAV_VERSION = "Nav_Version";

// Principal type constants
const PRIN_TYPE_INCREASE = "Principal_Type_Increase";
const PRIN_TYPE_DECREASE = "Principal_Type_Decrease";
const PRIN_TYPE_POSITIVE = "Principal_Type_Positive";
const PRIN_TYPE_NEGATIVE = "Principal_Type_Negative";

// Rounding constants
const ROUNDING_NONE = "Rounding_None";
const ROUNDING_BIAS_UP = "Rounding_Bias_Up";
const ROUNDING_BIAS_DOWN = "Rounding_Bias_Down";
const ROUNDING_UP = "Rounding_Up";
const ROUNDING_TRUNCATE = "Rounding_Truncate";
const ROUNDING_BANKERS = "Rounding_Bankers";

// Help group constants
const HelpCurrentValue = "CurrentValue";
const HelpInterestChange = "InterestChange";
const HelpPrincipalChange = "PrincipalChange";
const HelpStatisticValue = "StatisticValue";
const HelpSkipPeriods = "SkipPeriods";
const HelpDescriptor = "Descriptor";
const HelpParameter = "Parameter";
const HelpPreferences = "Preferences";
const HelpChart = "Chart";
const HelpConfirm = "Confirm";
const HelpInsertEvent = "InsertEvent";
const HelpNewCashflow = "NewCashflow";
const HelpSummary = "Summary";

// Help constants
const HELP_CONCEPTS = "Help_Concepts";
const HELP_CASHFLOW = "Help_Cashflow";
const HELP_TITLE_INFO = "Help_Title_Info";
const HELP_TITLE_ERROR = "Help_Title_Error";

// Tutorial constants
const TUTORIAL_LOAN = "Tutorial_Loan";
const TUTORIAL_ANNUITY = "Tutorial_Annuity";
const TUTORIAL_BOND = "Tutorial_Bond";
const TUTORIAL_INVESTMENT = "Tutorial_Investment";

// From the book "Show Me the Numbers: Designing Tables and Graphs to Enlighten" 
const chartColors = [
	{ medium: "#5DA5DA", light: "#88BDE6"},
	{ medium: "#FAA43A", light: "#FBB258"},
	{ medium: "#60BD68", light: "#90CD97"},
	{ medium: "#F17CB0", light: "#F6AAC9"},
	{ medium: "#B2912F", light: "#BFA554"},
	{ medium: "#B276B2", light: "#BC99C7"},
	{ medium: "#DECF3F", light: "#EDDD46"}
];

let config = {
    localeStr: "",
    encoding: "utf-8",
    decimalDigits: 2,
    helpForms: null,
    helpTitleInfo: "",
    helpTitleError: ""
};

/**
 * Chart utility class.
 */
class ChartUtility {

    /**
     * Create a chart line dataset.
     * @param {object} self The self object.
     * @param {object} tab The tab structure.
     * @param {string} name The dataset name.
     * @param {number} format The dataset format.
     * @param {bool} accum Accumulate the charted value.
     * @param {string} color The foreground color.
     * @param {string} colorBk The background color.
     * @param {bool} fill Fill regions with colorBk.
     * @param {bool} useCFLabels Use the cashflow labels 
     *      (for multiple cashflow charts).
     * @return {object} The resulting dataset.
     */    
     static createChartLineDataSet(self, tab, name, format, accum, color, colorBk, fill, useCFLabels) {
        let data = [];
        let value = null;

        for (let row of tab.amValues.expanded) {
            let date = null;
            for (let key in row) {
                if (key === FIELD_DATE) {
                    date = new Date(self.engine.format_date_in(row[key]));
                    break;
                }
            }

            let val = null;
            for (let key in row) {
                if (key === name) {
                    switch (format) {
                        case FORMAT_DATE:
                            val = new Date(self.engine.format_date_in(row[key]));
                            break;
                        case FORMAT_INTEGER:
                            val = parseInt(self.engine.format_integer_in(row[key]));
                            break;
                        case FORMAT_DECIMAL:
                            // Approximate for charting
                            val = parseFloat(self.engine.format_decimal_in(row[key]));
                            break;
                        case FORMAT_CURRENCY:                    
                            // Approximate for charting
                            val = parseFloat(self.engine.format_currency_in(row[key]));
                            break;
                        default:
                            val = row[key];
                            break;
                    }
                    break;
                }
            }

            if (!date || !val) continue;

            switch (format) {
                case FORMAT_INTEGER:
                case FORMAT_DECIMAL:
                case FORMAT_CURRENCY: 
                    value = accum && value ? value + val : val;
                    break;
                default:
                    value = val;
                    break;
            }

            data.push({
                x: date,
                y: value
            });
        }

        return {
            label: useCFLabels ? tab.label : name,
            fill: fill,
            borderColor: color,
            backgroundColor: colorBk,
            data: data,
            pointRadius: 0
        };
    }

    /**
     * Create chart line datasets.
     * @param {object} inputData The inputData structure.
     * @param {number} index The tab index.
     * @param {bool} useCFLabels Use the cashflow labels 
     *      (for multiple cashflow charts).
     * @return {object} The resulting datasets.
     */    
     static createChartLineDataSets(inputData, index, useCFLabels) {
        let self = inputData.self;
        let tab = self.tabs[index];
        let chartDef = inputData.chartDef
        let colorOffset = chartDef.colorOffset;
        let fill = chartDef.fill;
        let datasets = [];

        for (let column of chartDef.columns) {
            let name = column.name;
            let accum = column.accumulate;
            let color = chartColors[(inputData.dsIndex + colorOffset) % chartColors.length].medium;
            let colorBk = chartColors[(inputData.dsIndex + colorOffset) % chartColors.length].light;

            let amColumns = self.tabs[index].amColumns;
            let colIndex = 0;
            for (; colIndex < amColumns.length; ++colIndex) {
                if (name === amColumns[colIndex].col_name) break;
            }

            if (colIndex >= amColumns.length) continue;

            let format = tab.amColumns[colIndex].format;
            
            datasets.push(ChartUtility.createChartLineDataSet(self, tab, name, format, accum, color, colorBk, fill, useCFLabels));
            
            ++inputData.dsIndex;
        }

        return datasets;
    }

    /**
     * Create chart line structure.
     * @param {object} inputData The inputData structure.
     * @return {object} The resulting structure.
     */    
    static inputChartFn(inputData) {
        let self = inputData.self;
        let dataSets = [];
        inputData.dsIndex = 0;

        if (!inputData.chartDef.allCashflows) {
            dataSets = ChartUtility.createChartLineDataSets(inputData, self.activeTabIndex, false);
        } else {
            for (let index = 0; index < self.tabs.length; ++index) {
                for (let ds of ChartUtility.createChartLineDataSets(inputData, index, true)) {
                    dataSets.push(ds);
                }
            }
        }

        let canvasChart = document.getElementById("canvasChart");
        new Chart(canvasChart, {
            type: 'line',
            data: {
                datasets: dataSets
            },
            options: {
                responsive: true,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        display: true,
                        time: {
                            unit: 'month'
                        }
                    }],
                    yAxes: [{
                        display: true
                    }]
                }
            }
        });    
    }

    /**
     * Load the chart definitions.
     * @param {object} chartDefs The chart definitions list.
     */
    static loadChartDefs(chartDefs) {
    
        for (let chartDef of chartDefs) {    
            let defs = chartDef.value.split('|');
            if (defs.length > 1) {
                let def = defs[0].split('~');        
                if (def.length === 4) {
                    chartDef.description = def[0];
                    chartDef.allCashflows = def[1] === '1';
                    chartDef.colorOffset = parseInt(def[2]);
                    chartDef.fill = def[3] === '1';
                }
    
                chartDef.columns = new Array();
                for (let index = 1; index < defs.length; ++index) {
                    let def = defs[index].split('~');
                    if (def.length !== 2) continue;
    
                    let chartCol = {
                        name: def[0],
                        accumulate: def[1] === '1'
                    };
    
                    chartDef.columns.push(chartCol);
                }
            }
        }
    }
}

/**
 * Updater helper class.
 */
 class Updater {

    /**
     * Create template events and refresh display.
     * @param {object} self Self object.
     * @param {string} event Event name.
     */    
     static createTemplateEvents(self, event) {            
        let tab = self.tabs[self.activeTabIndex];
            
        let result = self.engine.create_template_events(
            tab.group, event, self.activeTabIndex);
            
        let events = result.split('|');
        if (events.length === 0) return;
        
        let tokens = events[0].split('~');
        if (tokens.length !== 3) return;

        let eventDate = tokens[0];
        let sortOrder = parseInt(tokens[1]);
        let paramCount = parseInt(tokens[2]);
        tab.lastFocused.colDef = null; // Start at Date column

        let rowIndex = Updater.refreshEvents(self, eventDate, sortOrder);
        Updater.refreshAmResults(self);
        Updater.updateTabLabel(self, self.activeTabIndex, true);

        if (paramCount === 0) return;

        setTimeout(function() {
            ModalDialog.showParameters(self, rowIndex, TABLE_EVENT);
        }, 100);
    }

    /**
     * Focus the event grid and the last focused cell.
     * @param {object} tab Tab object.
     */    
    static focusEventGrid(tab) {   
        tab.grdEvent.focus();
        if (!tab.lastFocused.colDef) return;

        tab.grdEventOptions.api.setFocusedCell(tab.lastFocused.rowIndex, tab.lastFocused.column);
    }

    /**
     * Get the eom by extension.
     * @param {object} self Self object.
     * @param {number} rowIndex Row index.
     * @param {number} tableType The type of table.
     */    
     static getEom(self, rowIndex, tableType) {
        let extension;

        if (tableType === TABLE_EVENT) {
            extension = self.tabs[self.activeTabIndex].eventValues[rowIndex].extension;
        } else if (self.tabs[self.activeTabIndex].expanded) {
            extension = self.tabs[self.activeTabIndex].amValues.expanded[rowIndex].extension;
        } else {
            extension = self.tabs[self.activeTabIndex].amValues.compressed[rowIndex].extension;
        }
        
        if ("current-value" in extension) {
            let ext = extension["current-value"];
            return ext["eom"] === "true";
        }
        
        if ("interest-change" in extension) {
            let ext = extension["interest-change"];
            return false;
        }
        
        if ("statistic-value" in extension) {
            let ext = extension["statistic-value"];
            return ext["eom"] === "true";
        }

        let ext = extension["principal-change"];
        return ext["eom"] === "true";
    }

    /**
     * Get string resource.
     * @param {object} self Self object.
     * @param {string} name Resource name.
     * @return {string} The return resource string.
     */
    static getResource(self, name) {
       return self.engine.get_resource(self.activeTabIndex, name); // -1 will return a user locale resource string
    }

    /**
     * Refresh events.
     * @param {object} self Self object.
     * @param {string} eventDate Date or null.
     * @param {number} sortOrder Sort order.
     * @return {number} The event row index.
     */
     static refreshEvents(self, eventDate, sortOrder) {
        if (self.activeTabIndex < 0) return 0;

        let tab = self.tabs[self.activeTabIndex];

        tab.grdEventOptions.api.stopEditing();
        tab.grdEventOptions.api.clearFocusedCell();

        tab.eventValues = JSON.parse(self.engine.table_values(self.activeTabIndex, TABLE_EVENT));        

        tab.grdEventOptions.api.setRowData(tab.eventValues);  

        let rowIndex = tab.lastFocused.rowIndex > 0 ? tab.lastFocused.rowIndex : 0;
        if (eventDate.length > 0) {
            rowIndex = self.engine.get_event_by_date(self.activeTabIndex, eventDate, sortOrder);
        }

        let column = null;
        if (tab.lastFocused.colDef) {
            column = tab.lastFocused.column;
        } else {
            column = tab.grdEventOptions.columnApi.getColumn(FIELD_DATE);
        }
        if (!column) return rowIndex;

        tab.grdEventOptions.api.setFocusedCell(rowIndex, column);
        
        return rowIndex;
    }

    /**
     * Refresh amortization results.
     * @param {object} self Self object.
     */
     static refreshAmResults(self) {
        if (self.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];

        tab.amValues = JSON.parse(self.engine.table_values(self.activeTabIndex, TABLE_AM));        

        if (tab.expanded) {
            tab.grdAmOptions.api.setRowData(tab.amValues.expanded);  
        } else {
            tab.grdAmOptions.api.setRowData(tab.amValues.compressed);  
        }      

        Updater.refreshStatusLine(self);  
    }

    /**
     * Clear status line.
     */
     static clearStatusLine() {

        let divStatus = document.getElementById("divStatus");

        divStatus.innerText = "";  
    }

    /**
     * Refresh status line.
     * @param {object} self Self object.
     */
     static refreshStatusLine(self) {
        if (self.activeTabIndex < 0) return;

        let divStatus = document.getElementById("divStatus");

        divStatus.innerText = self.engine.get_cashflow_status(
            self.activeTabIndex, self.tabs[self.activeTabIndex].status);  
    }
                    
    /**
     * Update the tab label.
     * @param {object} self Self object.
     * @param {number} cfIndex Cashflow index.
     * @param {bool} savePending Save pending.
     */    
     static updateTabLabel(self, cfIndex, savePending) {
        if (cfIndex < 0) return;

        let tab = self.tabs[cfIndex];
        tab.savePending = savePending;

        let spanLabel = tab.divTab.querySelector(".tabLabel");
        spanLabel.innerHTML = tab.label + (savePending ? "*" : "") + " ";
    }
}

// The following global declarations should be static within the ModalDialog class once stable.

// The modal help group.
let modalHelpGroup = "";
// The modal output function.
let modalOutputFn = null;
// The modal final function.
let modalFinalFn = null;

// The modal general help object.
let modalHelpGeneral = null;
// The modal temporary help objects.
let modalHelpTemps = [];

/**
 * Modal dialog helper class.
 */
class ModalDialog {

    /**
     * Initialize the modal dialog events.
     */    
    static modalInit() {
        let elem = document.getElementById("modalHelp");
        modalHelpGeneral = new bootstrap.Popover(elem, {
            content: ModalDialog.modalHelpContent,
            title: ModalDialog.modalHelpTitle,
            customClass: "div-popover",
            html: true
        });

        document.getElementById("divModal").addEventListener("click", e => ModalDialog.modalClick(e), true); // Capture
        document.getElementById("modalBody").addEventListener("keyup", e => ModalDialog.modalKeyUp(e));
        document.getElementById("modalClose").addEventListener("click", () => ModalDialog.modalClose(false));
        document.getElementById("modalCancel").addEventListener("click", () => ModalDialog.modalClose(false));
        document.getElementById("modalOK").addEventListener("click", () => ModalDialog.modalClose(true));
    }

    /**
     * Show a modal dialog.
     * @param {string} title The modal dialog title.
     * @param {string} helpGroup The modal help group.
     * @param {object} body The modal dialog body.
     * @param {object} options The options structure.
     */    
     static modalShow(title, helpGroup, body, options = {}) {

        let modalTitle = document.getElementById("modalTitle");
        let modalBody = document.getElementById("modalBody");

        modalTitle.innerHTML = title;
        modalBody.innerHTML = body;

        modalHelpGroup = helpGroup;
        modalOutputFn = options.outputFn;
        modalFinalFn = options.finalFn;

        let btnCancel = document.getElementById("modalCancel");
        let btnOK = document.getElementById("modalOK");

        btnOK.innerHTML = options.textOK ? options.textOK : "OK";
        btnCancel.innerHTML = options.textCancel ? options.textCancel : "";
        btnCancel.style.display = options.textCancel ? "inline-block" : "none";

        let divBackground = document.getElementById("divBackground");
        let divModal = document.getElementById("divModal");

        divModal.classList.remove("div-modal");
        divModal.classList.remove("div-modal-lg");
        divModal.classList.add(options.largeModal ? "div-modal-lg" : "div-modal");

        divBackground.style.display = "block";
        divModal.style.display = "block";

        modalHelpTemps = [];
        
        let elems = document.getElementsByClassName("btnHelp");
        for (let elem of elems) {
            modalHelpTemps.push(new bootstrap.Popover(elem, {
                content: ModalDialog.modalHelpContent,
                title: ModalDialog.modalHelpTitle,
                customClass: "div-popover",
                html: true
            }));
        }
        
        elems = document.getElementsByClassName("btnHelpDefault");
        for (let elem of elems) {
            modalHelpTemps.push(new bootstrap.Popover(elem, {
                customClass: "div-popover",
                html: true
            }));
        }

        if (options.inputFn) {
            options.inputFn(options.inputData);
        }

        let firstInput = modalBody.querySelector("input,select");
        if (firstInput) firstInput.focus();
    }

    /**
     * Close the currently open modal dialog.
     * @param {bool} isOK The OK button was pressed.
     */    
     static modalClose(isOK) {

        modalHelpGeneral.hide();

        for (let help of modalHelpTemps) {
            help.dispose();
        }

        modalHelpTemps = [];

        let result = null;
        if (modalOutputFn) {
            result = modalOutputFn(isOK);
            if (!result) return;
        }

        let divBackground = document.getElementById("divBackground");
        let divModal = document.getElementById("divModal");

        divBackground.style.display = "none";
        divModal.style.display = "none";

        let modalTitle = document.getElementById("modalTitle");
        let modalBody = document.getElementById("modalBody");

        modalTitle.innerHTML = "";
        modalBody.innerHTML = "";

        let finalFn = modalFinalFn;

        modalHelpGroup = "";
        modalOutputFn = null;
        modalFinalFn = null;

        if (finalFn) {
            result = finalFn(isOK, result); // A recursive call to modalShow can be done here
        }
    }

    /**
     * Called for help content with a modal dialog.
     */    
    static modalHelpContent() {
        let helpGroup = modalHelpGroup;
        let helpKey = this.dataset.help;

        let helpElem = null;
        for (let elem of config.helpForms) {
            if (elem.group === helpGroup && elem.name == helpKey) {
                helpElem = elem;
                break;
            }
        }

        if (!helpElem) return "";

        let result = "";
        for (let s of helpElem.value) {
            if (result.length > 0) result += " ";
            result += s;
        }

        return result;
    }

    /**
     * Called for help title with a modal dialog.
     */    
     static modalHelpTitle() {
        let helpGroup = modalHelpGroup;
        let helpKey = this.dataset.help;
 
        return helpGroup + "/" + helpKey;
     }
 
    /**
     * Event type output callback.
     * @param {object} self Self object.
     * @param {number} rowIndex Event row index.
     */
     static extensionOutput(self, rowIndex) {
        if (self.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
        let row = tab.eventValues[rowIndex];
        let extension = JSON.parse(JSON.stringify(row.extension)); // Copy

        if ("current-value" in extension) {
            let ext = extension["current-value"];

            let cvEom = document.getElementById("cvEom");
            ext["eom"] = cvEom.getAttribute("checked") ? true : false;

            let cvPassive = document.getElementById("cvPassive");
            ext["passive"] = cvPassive.getAttribute("checked") ? true : false;

            let cvPresent = document.getElementById("cvPresent");
            ext["present"] = cvPresent.getAttribute("checked") ? true : false;
        } else if ("interest-change" in extension) {
            let ext = extension["interest-change"];

            let icMethod = document.getElementById("icMethod");
            ext["interest-method"] = icMethod.options[icMethod.selectedIndex].value;

            let icDayCount = document.getElementById("icDayCount");
            ext["day-count-basis"] = icDayCount.options[icDayCount.selectedIndex].value

            let icDaysInYear = document.getElementById("icDaysInYear");
            let val = parseInt(icDaysInYear.value);
            ext["days-in-year"] = isNaN(val) ? "0" : val.toString();

            let icEffFreq = document.getElementById("icEffFreq");
            ext["effective-frequency"] = icEffFreq.options[icEffFreq.selectedIndex].value

            let icIntFreq = document.getElementById("icIntFreq");
            ext["interest-frequency"] = icIntFreq.options[icIntFreq.selectedIndex].value

            let icRoundBal = document.getElementById("icRoundBal");
            ext["round-balance"] = icRoundBal.options[icRoundBal.selectedIndex].value
                    
            let icRoundDD = document.getElementById("icRoundDD");
            val = parseFloat(icRoundDD.value);            
            ext["round-decimal-digits"] = isNaN(val) ? "0" : val.toString();
        } else if ("statistic-value" in extension) {
            let ext = extension["statistic-value"];

            let svName = document.getElementById("svName");
            ext["name"] = svName.value;

            let svEom = document.getElementById("svEom");
            ext["eom"] = svEom.getAttribute("checked") ? true : false;

            let svFinal = document.getElementById("svFinal");
            ext["final"] = svFinal.getAttribute("checked") ? true : false;
        } else {
            let ext = extension["principal-change"];

            let pcType = document.getElementById("pcType");
            ext["principal-type"] = pcType.options[pcType.selectedIndex].value

            let pcEom = document.getElementById("pcEom");
            ext["eom"] = pcEom.getAttribute("checked") ? true : false;

            let pcPrinFirst = document.getElementById("pcPrinFirst");
            ext["principal-first"] = pcPrinFirst.getAttribute("checked") ? true : false;

            let pcBalStats = document.getElementById("pcBalStats");
            ext["statistic"] = pcBalStats.getAttribute("checked") ? true : false;

            let pcAuxiliary = document.getElementById("pcAuxiliary");
            ext["auxiliary"] = pcAuxiliary.getAttribute("checked") ? true : false;

            let pcAuxPassive = document.getElementById("pcAuxPassive");
            ext["passive"] = pcAuxPassive.getAttribute("checked") ? true : false;
        }

        return extension;
    }
    
    /**
     * Event type output callback.
     * @param {object} self Self object.
     * @param {number} rowIndex Event row index.
     * @param {object} data Output data.
     */
     static extensionFinal(self, rowIndex, data) {
        if (self.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
        let row = tab.eventValues[rowIndex];
        let extension = data;

        let result = self.engine.set_extension_values(self.activeTabIndex, rowIndex, JSON.stringify(extension));        
        if (result.length > 0) {
            row.extension = extension;

            let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(tab.lastFocused.rowIndex);
            gridRow.setDataValue(tab.lastFocused.colDef.col_name, result);

            Updater.refreshAmResults(self);
            Updater.updateTabLabel(self, self.activeTabIndex, true);
        }
    }

    /**
     * Respond to the modal click capture event.
     * @param {object} e Event object.
     */    
    static modalClick(e) {

        if (e && e.target && (
            e.target.hasAttribute("aria-describedby") || 
            e.target.parentElement && e.target.parentElement.hasAttribute("aria-describedby"))) return;

        modalHelpGeneral.hide();

        for (let help of modalHelpTemps) {
            help.hide();
        }
    }

    /**
     * Respond to the modal dialog key up.
     * @param {object} e Event object.
     */    
    static modalKeyUp(e) {

        if (e.keyCode === 27) {
            ModalDialog.modalClick(null);
            return;
        }

        if (e.keyCode !== 13 || e.shiftKey || e.ctrlKey || e.altKey) return;

        ModalDialog.modalClose(true);
    }
    
    /**
     * Show a chart in a modal dialog.
     * @param {object} self Self object.
     * @param {object} chartDef The chart definition.
     */    
     static showChart(self, chartDef) {
        let body =
            `<canvas id="canvasChart" class="max-element"></canvas>`;

        ModalDialog.modalShow(chartDef.description, HelpChart, body, { 
            largeModal: true,
            inputFn: ChartUtility.inputChartFn,
            inputData: {
                self: self,
                chartDef: chartDef
            } 
        });    
    }

    /**
     * Show a confirmation modal dialog.
     * @param {object} self Self object.
     * @param {string} text The confirmation text.
     * @param {object} confirmFn The function to call if OK.
     * @param {object} cancelFn The function to call if Cancel.
     * @param {number} index The tab index.
     */    
     static showConfirm(self, text, confirmFn, cancelFn, index) {

        ModalDialog.modalShow(Updater.getResource(self, MODAL_CONFIRMATION), HelpConfirm, text, { 
            textCancel: Updater.getResource(self, MODAL_NO),
            textOK: Updater.getResource(self, MODAL_YES),
            finalFn: (isOK) => {                        
                if (isOK) {
                    setTimeout(function() {
                        confirmFn(self, index);
                    }, 100);
                } else {
                    setTimeout(function() {
                        cancelFn(self, index);
                    }, 100);
                }
            }
        });    
    }

    /**
     * Show a descriptor list in a modal dialog.
     * @param {object} self Self object.
     * @param {number} rowIndex The row index.
     * @param {number} tableType The type of table.
     */    
     static showDescriptors(self, rowIndex, tableType) {
        let body =
            `<div class="row">
                <div class="col-2">
                    <strong>${Updater.getResource(self, MODAL_DESC_GROUP)}</strong>
                </div>
                <div class="col-2">
                    <strong>${Updater.getResource(self, MODAL_DESC_NAME)}</strong>
                </div>
                <div class="col-1">
                    <strong>${Updater.getResource(self, MODAL_DESC_TYPE)}</strong>
                </div>
                <div class="col-1">
                    <strong>${Updater.getResource(self, MODAL_DESC_CODE)}</strong>
                </div>
                <div class="col-5">
                    <strong>${Updater.getResource(self, MODAL_DESC_VALUE)}</strong>
                </div>
                <div class="col-1">
                    <strong>${Updater.getResource(self, MODAL_DESC_PROPAGATE)}</strong>
                </div>
            </div>`;
            
        let list = self.engine.parse_descriptors(self.activeTabIndex, rowIndex, tableType);
        
        for (let elem of list) {
            body +=
                `<div class="row">
                    <div class="col-2">
                        ${elem.group}
                    </div>
                    <div class="col-2">
                        ${elem.name}
                    </div>
                    <div class="col-1">
                        ${elem.desc_type}
                    </div>
                    <div class="col-1">
                        ${elem.code}
                    </div>
                    <div class="col-5">
                        ${elem.value}
                    </div>
                    <div class="col-1">
                        ${elem.propagate}
                    </div>
                </div>`;
        }

        ModalDialog.modalShow(Updater.getResource(self, MODAL_DESCRIPTOR_LIST), HelpDescriptor, body, { largeModal: true });    
    }

    /**
     * Show an extension in a modal dialog.
     * @param {object} self Self object.
     * @param {number} rowIndex Row index.
     * @param {number} tableType The type of table.
     * @param {object} options The options structure.
     */    
    static showExtension(self, rowIndex, tableType, options = {}) {
        let enable = tableType === TABLE_EVENT;
        let extension;

        if (tableType === TABLE_EVENT) {
            extension = self.tabs[self.activeTabIndex].eventValues[rowIndex].extension;
        } else if (self.tabs[self.activeTabIndex].expanded) {
            extension = self.tabs[self.activeTabIndex].amValues.expanded[rowIndex].extension;
        } else {
            extension = self.tabs[self.activeTabIndex].amValues.compressed[rowIndex].extension;
        }
        
        if ("current-value" in extension) {
            let ext = extension["current-value"];
            ModalDialog.modalShow(Updater.getResource(self, MODAL_CURRENT_VALUE), HelpCurrentValue,
                `<div class="row">
                    <div class="col-6">
                        <label for="cvEom" class="col-form-label">${Updater.getResource(self, MODAL_CV_EOM)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="eom"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="cvEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="cvPassive" class="col-form-label">${Updater.getResource(self, MODAL_CV_PASSIVE)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="passive"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="cvPassive" ${ext["passive"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="cvPresent" class="col-form-label">${Updater.getResource(self, MODAL_CV_PRESENT)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="present"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="cvPresent" ${ext["present"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>`,
                options
            );
            return;
        }

        if ("interest-change" in extension) {
            let ext = extension["interest-change"];
            let form = 
                `<div class="row">
                    <div class="col-6">
                        <label for="icMethod" class="col-form-label">${Updater.getResource(self, MODAL_IC_METHOD)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="interest-method"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icMethod" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="actuarial" ${ext["interest-method"] === 'actuarial' ? 'selected' : ''}>${Updater.getResource(self, METHOD_ACTUARIAL)}</option>
                            <option value="simple-interest" ${ext["interest-method"] === 'simple-interest' ? 'selected' : ''}>${Updater.getResource(self, METHOD_SIMPLE_INTEREST)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icDayCount" class="col-form-label">${Updater.getResource(self, MODAL_IC_DAY_COUNT)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="day-count-basis"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icDayCount" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="periodic" ${ext["day-count-basis"] === 'periodic' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_PERIODIC)}</option>
                            <option value="rule-of-78" ${ext["day-count-basis"] === 'rule-of-78' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_RULE_OF_78)}</option>
                            <option value="actual" ${ext["day-count-basis"] === 'actual' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_ACTUAL)}</option>
                            <option value="actual-actual-isma" ${ext["day-count-basis"] === 'actual-actual-isma' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_ACTUAL_ISMA)}</option>
                            <option value="actual-actual-afb" ${ext["day-count-basis"] === 'actual-actual-afb' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_ACTUAL_AFB)}</option>
                            <option value="actual-365L" ${ext["day-count-basis"] === 'actual-365L' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_ACTUAL_365L)}</option>
                            <option value="30" ${ext["day-count-basis"] === '30' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_30)}</option>
                            <option value="30E" ${ext["day-count-basis"] === '30E' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_30E)}</option>
                            <option value="30EP" ${ext["day-count-basis"] === '30EP' ? 'selected' : ''}>${Updater.getResource(self, DAY_COUNT_30EP)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icDaysInYear" class="col-form-label">${Updater.getResource(self, MODAL_IC_DAYS_IN_YEAR)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="days-in-year"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input type="text" spellcheck="false" id="icDaysInYear" class="form-control form-control-sm" value="${ext["days-in-year"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icEffFreq" class="col-form-label">${Updater.getResource(self, MODAL_IC_EFF_FREQ)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="effective-frequency"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icEffFreq" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="none" ${ext["effective-frequency"] === 'none' ? 'selected' : ''}>${Updater.getResource(self, FREQ_NONE)}</option>
                            <option value="1-year" ${ext["effective-frequency"] === '1-year' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_YEAR)}</option>
                            <option value="6-months" ${ext["effective-frequency"] === '6-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_6_MONTHS)}</option>
                            <option value="4-months" ${ext["effective-frequency"] === '4-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_4_MONTHS)}</option>
                            <option value="3-months" ${ext["effective-frequency"] === '3-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_3_MONTHS)}</option>
                            <option value="2-months" ${ext["effective-frequency"] === '2-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_2_MONTHS)}</option>
                            <option value="1-month" ${ext["effective-frequency"] === '1-month' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_MONTH)}</option>
                            <option value="half-month" ${ext["effective-frequency"] === 'half-month' ? 'selected' : ''}>${Updater.getResource(self, FREQ_HALF_MONTH)}</option>
                            <option value="4-weeks" ${ext["effective-frequency"] === '4-weeks' ? 'selected' : ''}>${Updater.getResource(self, FREQ_4_WEEKS)}</option>
                            <option value="2-weeks" ${ext["effective-frequency"] === '2-weeks' ? 'selected' : ''}>${Updater.getResource(self, FREQ_2_WEEKS)}</option>
                            <option value="1-week" ${ext["effective-frequency"] === '1-week' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_WEEK)}</option>
                            <option value="1-day" ${ext["effective-frequency"] === '1-day' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_DAY)}</option>
                            <option value="continuous" ${ext["effective-frequency"] === 'continuous' ? 'selected' : ''}>${Updater.getResource(self, FREQ_CONTINUOUS)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icIntFreq" class="col-form-label">${Updater.getResource(self, MODAL_IC_INT_FREQ)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="interest-frequency"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icIntFreq" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                        <option value="none" ${ext["interest-frequency"] === 'none' ? 'selected' : ''}>${Updater.getResource(self, FREQ_NONE)}</option>
                        <option value="1-year" ${ext["interest-frequency"] === '1-year' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_YEAR)}</option>
                        <option value="6-months" ${ext["interest-frequency"] === '6-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_6_MONTHS)}</option>
                        <option value="4-months" ${ext["interest-frequency"] === '4-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_4_MONTHS)}</option>
                        <option value="3-months" ${ext["interest-frequency"] === '3-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_3_MONTHS)}</option>
                        <option value="2-months" ${ext["interest-frequency"] === '2-months' ? 'selected' : ''}>${Updater.getResource(self, FREQ_2_MONTHS)}</option>
                        <option value="1-month" ${ext["interest-frequency"] === '1-month' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_MONTH)}</option>
                        <option value="half-month" ${ext["interest-frequency"] === 'half-month' ? 'selected' : ''}>${Updater.getResource(self, FREQ_HALF_MONTH)}</option>
                        <option value="4-weeks" ${ext["interest-frequency"] === '4-weeks' ? 'selected' : ''}>${Updater.getResource(self, FREQ_4_WEEKS)}</option>
                        <option value="2-weeks" ${ext["interest-frequency"] === '2-weeks' ? 'selected' : ''}>${Updater.getResource(self, FREQ_2_WEEKS)}</option>
                        <option value="1-week" ${ext["interest-frequency"] === '1-week' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_WEEK)}</option>
                        <option value="1-day" ${ext["interest-frequency"] === '1-day' ? 'selected' : ''}>${Updater.getResource(self, FREQ_1_DAY)}</option>
                        <option value="continuous" ${ext["interest-frequency"] === 'continuous' ? 'selected' : ''}>${Updater.getResource(self, FREQ_CONTINUOUS)}</option>
                    </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icRoundBal" class="col-form-label">${Updater.getResource(self, MODAL_IC_ROUND_BAL)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="round-balance"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icRoundBal" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="none" ${ext["round-balance"] === 'none' ? 'selected' : ''}>${Updater.getResource(self, ROUNDING_NONE)}</option>
                            <option value="bankers" ${ext["round-balance"] === 'bankers' ? 'selected' : ''}>${Updater.getResource(self, ROUNDING_BANKERS)}</option>
                            <option value="bias-up" ${ext["round-balance"] === 'bias-up' ? 'selected' : ''}>${Updater.getResource(self, ROUNDING_BIAS_UP)}</option>
                            <option value="bias-down" ${ext["round-balance"] === 'bias-down' ? 'selected' : ''}>${Updater.getResource(self, ROUNDING_BIAS_DOWN)}</option>
                            <option value="up" ${ext["round-balance"] === 'up' ? 'selected' : ''}>${Updater.getResource(self, ROUNDING_UP)}</option>
                            <option value="truncate" ${ext["round-balance"] === 'truncate' ? 'selected' : ''}>${Updater.getResource(self, ROUNDING_TRUNCATE)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icRoundDD" class="col-form-label">${Updater.getResource(self, MODAL_IC_ROUND_DD)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="round-decimal-digits"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input type="text" spellcheck="false" id="icRoundDD" class="form-control form-control-sm" value="${ext["round-decimal-digits"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>`;

            let stat = ext["interest-statistics"];
            if (stat) {
                form +=
                    `<div class="row">
                        <div class="col-6">
                            <label for="icStatNar" class="col-form-label">${Updater.getResource(self, MODAL_IC_STAT_NAR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="nominal-annual-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatNar class="form-control form-control-sm" value="${stat["nar"]}" disabled>                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icStatEar" class="col-form-label">${Updater.getResource(self, MODAL_IC_STAT_EAR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="effective-annual-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatEar class="form-control form-control-sm" value="${stat["ear"]}" disabled>                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icStatPr" class="col-form-label">${Updater.getResource(self, MODAL_IC_STAT_PR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="periodic-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatPr class="form-control form-control-sm" value="${stat["pr"]}" disabled>                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icStatDr" class="col-form-label">${Updater.getResource(self, MODAL_IC_STAT_DR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="daily-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatDr class="form-control form-control-sm" value="${stat["dr"]}" disabled>                            
                        </div>
                    </div>`;
            }

            ModalDialog.modalShow(Updater.getResource(self, MODAL_INTEREST_CHANGE), HelpInterestChange, form, options);

            return;
        }
        
        if ("statistic-value" in extension) {
            let ext = extension["statistic-value"];
            ModalDialog.modalShow(Updater.getResource(self, MODAL_STATISTIC_CHANGE), HelpStatisticValue,
                `<div class="row">
                    <div class="col-6">
                        <label for="svName" class="col-form-label">${Updater.getResource(self, MODAL_SV_NAME)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="name"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input type="text" spellcheck="false" id="svName" class="form-control form-control-sm" value="${ext["name"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="svEom" class="col-form-label">${Updater.getResource(self, MODAL_SV_EOM)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="eom"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="svEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="svFinal" class="col-form-label">${Updater.getResource(self, MODAL_SV_FINAL)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="final"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="svFinal" ${ext["final"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>`,
                options
            );
            return;
        }

        let ext = extension["principal-change"];
        ModalDialog.modalShow(Updater.getResource(self, MODAL_PRINCIPAL_CHANGE), HelpPrincipalChange,
            `<div class="row">
                <div class="col-6">
                    <label for="pcType" class="col-form-label">${Updater.getResource(self, MODAL_PC_TYPE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="principal-type"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <select id="pcType" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                        <option ${ext["principal-type"] === 'positive' ? 'selected' : ''}>positive</option>
                        <option ${ext["principal-type"] === 'negative' ? 'selected' : ''}>negative</option>
                        <option ${ext["principal-type"] === 'increase' ? 'selected' : ''}>increase</option>
                        <option ${ext["principal-type"] === 'decrease' ? 'selected' : ''}>decrease</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcEom" class="col-form-label">${Updater.getResource(self, MODAL_PC_EOM)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="eom"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcPrinFirst" class="col-form-label">${Updater.getResource(self, MODAL_PC_PRIN_FIRST)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="principal-first"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcPrinFirst" ${ext["principal-first"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcBalStats" class="col-form-label">${Updater.getResource(self, MODAL_PC_BAL_STAT)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="statistics"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcBalStats" ${ext["statistics"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcAuxiliary" class="col-form-label">${Updater.getResource(self, MODAL_PC_AUXILIARY)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="auxiliary"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcAuxiliary" ${ext["auxiliary"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcAuxPassive" class="col-form-label">${Updater.getResource(self, MODAL_PC_AUX_PASSIVE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="passive"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcAuxPassive" ${ext["passive"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>`,
            options
        );
    }

    /**
     * Show an insert event modal dialog.
     * @param {object} self Self object.
     */    
     static showInsertEvent(self) {
        let tab = self.tabs[self.activeTabIndex];
        let templateEvents = self.engine.get_template_event_names(tab.group);

        let body = "";

        let index = 0;
        for (let event of templateEvents) {
            body += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="radioEvent" id="radioEvent${index}" value="${event}">
                    <label class="form-check-label" for="radioEvent${index}">
                        ${event}
                    </label>
                </div>
            `;
            ++index;
        }

        ModalDialog.modalShow(Updater.getResource(self, MODAL_INSERT_EVENT), HelpInsertEvent, body, {
            textCancel: Updater.getResource(self, MODAL_CANCEL),
            textOK: Updater.getResource(self, MODAL_SUBMIT),
            outputFn: (isOK) => {
                if (!isOK) return {};

                let event = "";
                var radios = document.getElementsByName("radioEvent");
                for (let radio of radios) {
                    if (radio.checked) {
                        event = radio.value;
                        break;
                    }
                }

                let valid = event.length > 0;
                if (!valid) {
                    Toaster.toastError(Updater.getResource(self, MSG_SELECT_TEMPLATE_EVENT));
                    return null;
                }

                return {
                    event: event
                };
            },
            finalFn(isOK, data) {
                if (!isOK || !data.event) return;

                Updater.createTemplateEvents(self, data.event);
            }
        });
    }
    
    /**
     * Show a new cashflow modal dialog.
     * @param {object} self Self object.
     */    
     static showNewCashflow(self) {

        let templateGroups = self.engine.get_template_names();

        let body = 
            `<div class="row">
                <div class="col-6">
                    <label for="cfName" class="col-form-label">${Updater.getResource(self, MODAL_NC_NAME)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="name"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="cfName" class="form-control form-control-sm">
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="cfTemplate" class="col-form-label">${Updater.getResource(self, MODAL_NC_TEMPLATE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="template"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <select id="cfTemplate" class="form-select form-select-sm">
            `;

        for (let group of templateGroups) {
            body += `<option value="${group}">${group}</option>`;
        }

        body += 
            `       </select>
                </div>
            </div>`;

        ModalDialog.modalShow(Updater.getResource(self, MODAL_NEW_CASHFLOW), HelpNewCashflow, body, {
            textCancel: Updater.getResource(self, MODAL_CANCEL),
            textOK: Updater.getResource(self, MODAL_SUBMIT),
            outputFn: (isOK) => {
                if (!isOK) return {};

                let cfName = document.getElementById("cfName").value;
                let cfTemplate = document.getElementById("cfTemplate").value;
                
                let valid = cfName.length > 0 && cfTemplate.length > 0;
                if (!valid) {
                    Toaster.toastError(Updater.getResource(self, MSG_SELECT_CASHFLOW_TEMPLATE));
                    return null;
                }

                return {
                    cfName: cfName,
                    cfTemplate: cfTemplate
                };
            },
            finalFn(isOK, data) {
                if (!isOK || !data.cfName) return;

                let initialName = self.engine.create_cashflow_from_template_group(data.cfTemplate, data.cfName);
                if (initialName.length > 0) {
                    self.loadCashflow(data.cfName);
                    if (initialName === "*") return;                    
                    Updater.createTemplateEvents(self, initialName);
                }
            }
        });
    }

    /**
     * Show a parameter list in a modal dialog.
     * @param {object} self Self object.
     * @param {number} rowIndex The row index.
     * @param {number} tableType The type of table.
     */    
    static showParameters(self, rowIndex, tableType) {
        let enable = tableType === TABLE_EVENT;

        let list = self.engine.parse_parameters(self.activeTabIndex, rowIndex, tableType);

        let body = "";
        for (let elem of list) {
            body +=
                `<div class="row">
                    <div class="col-6">
                        ${elem.label.length > 0 ? elem.label : elem.name}
                        <a class="btn btnHelpDefault" role="button" tabindex="-1" data-bs-toggle="popover" title="${Updater.getResource(self, MODAL_PARAMETER_LIST)}" data-bs-content="${elem.description}"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input type="text" spellcheck="false" class="form-control form-control-sm parameter" 
                            value="${elem.sym_type === 'integer' ? elem.int_value : elem.sym_type === 'decimal' ? elem.dec_value : elem.str_value}" 
                            ${enable ? '' : 'disabled'}>
                    </div>
                </div>`; 
        }

        ModalDialog.modalShow(Updater.getResource(self, MODAL_PARAMETER_LIST), HelpParameter, body, {
            textCancel: enable ? Updater.getResource(self, MODAL_CANCEL) : "",
            textOK: enable ? Updater.getResource(self, MODAL_SUBMIT) : Updater.getResource(self, MODAL_OK),
            outputFn: (isOK) => {
                if (!enable || !isOK) return {};

                let parameters = document.getElementsByClassName("parameter");
                let params = "";

                let index = 0;
                for (let parameter of parameters) {
                    if (params.length > 0) params += "|";
                    params += parameter.value;
                    ++index;
                } 

                return { 
                    "parameters": params 
                };
            },
            finalFn: (isOK, data) => {    
                if (!enable || !isOK || !data.parameters) return;

                if (self.engine.set_parameter_values(self.activeTabIndex, rowIndex, data.parameters)) {
                    Updater.refreshAmResults(self);
                    Updater.updateTabLabel(self, self.activeTabIndex, true);        
                }
            }
        });
    }

    /**
     * Show a preferences a modal dialog.
     * @param {object} self Self object.
     * @param {number} cfIndex Cashflow index or -1 for user preferences.
     */    
     static showPreferences(self, cfIndex) {

        let pref = self.engine.get_preferences(cfIndex);
    
        ModalDialog.modalShow(Updater.getResource(self, cfIndex < 0 ? MODAL_USER_PREFERENCES : MODAL_CASHFLOW_PREFERENCES), HelpPreferences,
            `<div class="row">
                <div class="col-6">
                    <label for="prefLocale" class="col-form-label">${Updater.getResource(self, MODAL_PREF_LOCALE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="locale-str"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefLocale" class="form-control form-control-sm" value="${pref["locale_str"]}" disabled>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefGroup" class="col-form-label">${Updater.getResource(self, MODAL_PREF_GROUP)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="group"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefGroup" class="form-control form-control-sm" value="${pref["group"]}" disabled>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefCrossRate" class="col-form-label">${Updater.getResource(self, MODAL_PREF_CROSS_RATE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="cross-rate-code"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefCrossRate" class="form-control form-control-sm" value="${pref["cross_rate_code"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefEncoding" class="col-form-label">${Updater.getResource(self, MODAL_PREF_ENCODING)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="default-encoding"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefEncoding" class="form-control form-control-sm" value="${pref["default_encoding"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefFiscalYear" class="col-form-label">${Updater.getResource(self, MODAL_PREF_FISCAL_YEAR)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="fiscal-year-start"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="number" id="prefFiscalYear" class="form-control form-control-sm" value="${pref["fiscal_year_start"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefDecimalDigits" class="col-form-label">${Updater.getResource(self, MODAL_PREF_DECIMAL_DIGITS)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="decimal-digits"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="number" id="prefDecimalDigits" class="form-control form-control-sm" value="${pref["decimal_digits"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefTargetValue" class="col-form-label">${Updater.getResource(self, MODAL_PREF_TARGET_VALUE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="target-value"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefTargetValue" class="form-control form-control-sm" value="${pref["target"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>`, {
                textCancel: cfIndex >= 0 ? Updater.getResource(self, MODAL_CANCEL) : "",
                textOK: cfIndex >= 0 ? Updater.getResource(self, MODAL_SUBMIT) : Updater.getResource(self, MODAL_OK),
                outputFn: (isOK) => {
                    if (cfIndex < 0 || !isOK) return {};

                    return new WasmElemPreferences(
                        "", // Not set
                        "", // Not set
                        document.getElementById("prefCrossRate").value,
                        document.getElementById("prefEncoding").value,
                        parseInt(document.getElementById("prefFiscalYear").value),
                        parseInt(document.getElementById("prefDecimalDigits").value),
                        document.getElementById("prefTargetValue").value
                    );
                },
                finalFn: (isOK, data) => {    
                    if (cfIndex < 0 || !isOK || !data) return;
        
                    if (self.engine.set_preferences(cfIndex, data)) {
                        Updater.refreshEvents(self, "", 0);
                        Updater.refreshAmResults(self);
                        Updater.updateTabLabel(self, self.activeTabIndex, true);        
                    }
                }
            }
        );
    }
    
    /**
     * Show a frequency list in a modal dialog.
     * @param {object} self Self object.
     * @param {number} rowIndex The row index.
     * @param {number} tableType The type of table.
     */    
    static showSkipPeriods(self, rowIndex, tableType) {
        if (self.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
        let enable = tableType === TABLE_EVENT;

        let row;
        if (tableType === TABLE_EVENT) {
            row = tab.eventValues[rowIndex];
        } else {
            if (tab.expanded) {
                row = tab.amValues.expanded[rowIndex];
            } else {
                row = tab.amValues.compressed[rowIndex];
            }
        }

        let startDate = self.engine.format_date_in(row["Date"]);
        let frequency = row["Frequency"];
        let periods = row["Periods"] ? parseInt(self.engine.format_integer_in(row["Periods"])) : 1;
        let intervals = row["Intervals"] ? parseInt(self.engine.format_integer_in(row["Intervals"])) : 1;
        let eom = Updater.getEom(self, rowIndex, tableType);
        let skipPeriods = row["Skip-periods"];

        let body = `
            <div class="row">
                <div class="col-10">
                    <input type="range" class="form-range" min="0" max="${periods}" value="${skipPeriods.length}" id="skipPeriodsRange"  ${enable ? '' : 'disabled'}>
                </div>
                <div class="col-2">
                    <input class="max-width" type="number" min="0" max="${periods}" value="${skipPeriods.length}" id="skipPeriodsRangeValue"  ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div id="divSkipPeriods"></div>
        `;        

        let skipPeriodsChangeInfo = {
            startDate: startDate,
            frequency: frequency,
            periods: periods,
            intervals: intervals,
            eom: eom,
            skipPeriods: skipPeriods,
            newValue: skipPeriods.length,
            tableType: tableType
        };

        ModalDialog.modalShow(Updater.getResource(self, MODAL_SKIP_PERIODS), HelpSkipPeriods, body, {
            textCancel: Updater.getResource(self, MODAL_CANCEL),
            textOK: Updater.getResource(self, MODAL_SUBMIT),
            inputFn: (inputData) => {
                ModalDialog.showSkipPeriodsRangeChange(inputData.self, skipPeriodsChangeInfo, true);

                document.getElementById("skipPeriodsRange").addEventListener("input", 
                    (e) => ModalDialog.showSkipPeriodsInput(e, inputData.self, skipPeriodsChangeInfo));    
                document.getElementById("skipPeriodsRangeValue").addEventListener("change", 
                    (e) => ModalDialog.showSkipPeriodsChange(e, inputData.self, skipPeriodsChangeInfo));
            },
            inputData: {
                self: self
            },
            outputFn: (isOK) => {
                document.getElementById("skipPeriodsRange").removeEventListener("input", 
                    (e) => ModalDialog.showSkipPeriodsInput(e, inputData.self, skipPeriodsChangeInfo));
                document.getElementById("skipPeriodsRangeValue").addEventListener("change", 
                    (e) => ModalDialog.showSkipPeriodsChange(e, inputData.self, skipPeriodsChangeInfo));
    
                if (!isOK) return {};       

                for (let colDef of tab.eventColumns) {
                    if (colDef.col_name === "Skip-periods") {
                        let skipPeriods = "";
                        let elems = document.getElementsByClassName("chkSkipPeriods");                
                        for (let elem of elems) {
                            skipPeriods += (elem.checked ? "1" : "0");
                        } 
                        
                        return { skipPeriods: skipPeriods };
                    }
                }

                return {};
            },
            finalFn: (isOK, data) => {    
                if (!isOK || !data.hasOwnProperty("skipPeriods")) return;

                skipPeriodsChangeInfo.skipPeriods = data.skipPeriods;
                let colDef = tab.lastFocused.colDef;
                let rowIndex = tab.lastFocused.rowIndex;

                let tokens = self.engine.set_event_value(
                    colDef.col_name_index, colDef.col_type, colDef.code,
                    self.activeTabIndex, rowIndex, skipPeriodsChangeInfo.skipPeriods).split('|');

                if (tokens.length === 3) {       
                    let value = tokens[2];

                    let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(rowIndex);
                    gridRow.setDataValue(colDef.col_name, value);

                    Updater.refreshAmResults(self);
                    Updater.updateTabLabel(self, self.activeTabIndex, true);
                }
            }
        });    
    }

    /**
     * Respond to the skip periods input value changing.
     * @param {object} e Input event.
     * @param {object} self Self event.
     * @param {object} skipPeriodsChangeInfo Skip periods change info.
     */  
     static showSkipPeriodsInput(e, self, skipPeriodsChangeInfo) {  
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
     static showSkipPeriodsChange(e, self, skipPeriodsChangeInfo) {
        skipPeriodsChangeInfo.newValue = e.target.value;
        
        let range = document.getElementById("skipPeriodsRange");
        range.value = skipPeriodsChangeInfo.newValue;

        ModalDialog.showSkipPeriodsRangeChange(self, skipPeriodsChangeInfo);
    }
                    
    /**
     * Skip periods range change.
     * @param {object} self Self object.
     * @param {object} skipPeriodsChangeInfo Skip periods change information.
     * @param {bool} isInit Initial skip periods.
     */    
    static showSkipPeriodsRangeChange(self, skipPeriodsChangeInfo, isInit = false) {
        let enable = skipPeriodsChangeInfo.tableType === TABLE_EVENT;

        let skipPeriods = "";
        if (isInit) {
            skipPeriods = skipPeriodsChangeInfo.skipPeriods;
        } else {
            let elems = document.getElementsByClassName("chkSkipPeriods");                
            for (let elem of elems) {
                skipPeriods += (elem.checked ? "1" : "0");
            }
        }

        if (skipPeriodsChangeInfo.newValue > skipPeriods.length) {
            skipPeriods = skipPeriods.slice(0, skipPeriodsChangeInfo.newValue - 1);
        } else {
            let index = skipPeriodsChangeInfo.newValue - skipPeriods.length;
            while (index > 0) {
                skipPeriods += "0";
                --index;
            }
        }

        let newDate = skipPeriodsChangeInfo.startDate;
        let str = "";

        for (let index = 0; index < skipPeriodsChangeInfo.newValue; ++index) {
            str += `
                <div class="row">
                    <div class="col-6">
                        <label for="chkSkipPeriods${index}" class="col-form-label">${self.engine.format_date_out(newDate)}</label>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input chkSkipPeriods" type="checkbox" id="chkSkipPeriods${index}" 
                            ${skipPeriods[index] === '1' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
            `;

            newDate = self.engine.format_date_in(self.engine.date_new(
                skipPeriodsChangeInfo.startDate, newDate, skipPeriodsChangeInfo.frequency, 
                skipPeriodsChangeInfo.intervals, skipPeriodsChangeInfo.eom));
        }

        document.getElementById("divSkipPeriods").innerHTML = str;
    }

    /**
     * Show a cashflow summary in a modal dialog.
     * @param {object} self Self object.
     * @param {object} summary Summary items.
     */    
    static showSummary(self, summary) {
        let body = "";

        for (let sum of summary) {
            body +=
                `<div class="row">
                    <div class="col-6">
                        ${sum.label}
                    </div>
                    <div class="col-6">
                        ${sum.result}
                    </div>
                </div>`        
        }

        ModalDialog.modalShow(Updater.getResource(self, MODAL_CASHFLOW_SUMMARY), HelpSummary, body);
    }
}

/**
 * Toaster class.
 */
class Toaster {

    /**
     * Show a toast message.
     * @param {string} title The title to show in the toast.
     * @param {string} text The text to show in the toast.
     * @param {string} backgroundColor The toast's background color.
     */    
    static toast(title, text, backgroundColor) {
        let toast = document.createElement("div");
        toast.setAttribute("class", "toast");
        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", "assertive");
        toast.setAttribute("aria-atomic", "true");

        toast.innerHTML = `
            <div class="toast-header">
                <span class="toast-color-box rounded me-2" style="background-image:${backgroundColor}"></span>
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body toast-body-shade">
                ${text}
            </div>
        `;

        let toastContainer = document.getElementById("toast-container");
        toastContainer.appendChild(toast);

        (new bootstrap.Toast(toast)).show();
    }

    /**
     * Show an informational toast message.
     * @param {string} text The text to show in the toast.
     */    
     static toastInfo(text) {
        Toaster.toast(config.helpTitleInfo, text, "linear-gradient(to right, Blue, DarkBlue)");
    }

    /**
     * Show an error toast message.
     * @param {string} text The text to show in the toast.
     */    
     static toastError(text) {
        Toaster.toast(config.helpTitleError, text, "linear-gradient(to right, Red, DarkRed)");
    }
}

/**
 * Grid value with button renderer.
 */
class ValueBtnRenderer {
 
    /**
     * Perform any needed cleanup.
     */    
     destroy() {
        if (this.eButton) {
            this.eButton.removeEventListener("click", e => this.eventListener(
                e, null, null, null, null));
        }
        
        if (this.eGui) {
            this.eGui.removeEventListener("keyup", e => this.spacebarListener(
                e, null, null, null, null));
        }
    }

    /**
     * Respond to the button click event.
     * @param {object} e Event object.
     * @param {object} callback The callback function.
     * @param {object} self The caller's scope.
     * @param {number} rowIndex The row index.
     * @param {numbert} gridType The type of grid.
     */    
     eventListener(e, callback, self, rowIndex, gridType) {
        if (!callback) return;

        callback(self, rowIndex, gridType);
    }

    /**
     * Respond to the spacebar entered event.
     * @param {object} e Event object.
     * @param {object} callback The callback function.
     * @param {object} self The caller's scope.
     * @param {number} rowIndex The row index.
     * @param {numbert} gridType The type of grid.
     */    
     spacebarListener(e, callback, self, rowIndex, gridType) {
        if (e.keyCode != 32 || !callback) return;

        callback(self, rowIndex, gridType);
    }
 
    /**
     * Return the UI object.
     * @return {object} The UI object.
     */    
    getGui() {
        return this.eGui;
    }
 
    /**
     * Return the value to display.
     * @param {object} params The renderer parameters.
     * @return {string} The value to display.
     */    
     getValueToDisplay(params) {
        return params.formatValue ? params.formatValue(params.value) : params.value;
     }

    /**
     * Initialize the renderer.
     * @param {object} params The renderer parameters.
     */    
     init(params) {
        this.eGui = document.createElement("div");
        this.eGui.setAttribute("class", "div-cell");
        this.eGui.setAttribute("tabindex", "0"); // So we get the keyup event
        
        this.valueCell = document.createElement("span");
        this.valueCell.setAttribute("class", "value-cell");
        this.eGui.appendChild(this.valueCell);

        this.btnCell = document.createElement("span");
        this.btnCell.setAttribute("class", "btn-cell");
        this.btnCell.innerHTML = `<i class="bi-command"></i>`;
        this.eGui.appendChild(this.btnCell);
 
        this.cellValue = this.getValueToDisplay(params);
        this.valueCell.innerHTML = this.cellValue;
 
        this.btnCell.addEventListener("click", e => this.eventListener(
            e, params.callback, params.self, params.rowIndex, params.gridType));

        this.eGui.addEventListener("keyup", e => this.spacebarListener(
            e, params.callback, params.self, params.rowIndex, params.gridType));
    }
 
    /**
     * Refresh the renderer.
     * @param {object} params The renderer parameters.
     * @return {bool} True if successfull.
     */    
     refresh(params) {
        this.cellValue = this.getValueToDisplay(params);
        this.valueCell.innerHTML = this.cellValue;
 
        return true;
    }

}