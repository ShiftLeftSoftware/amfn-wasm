/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

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
                if (key === "Date") {
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

        let event_date = tokens[0];
        let sort_order = parseInt(tokens[1]);
        let param_count = parseInt(tokens[2]);
        tab.lastFocusedColDef = null; // Start at Date column

        let rowIndex = Updater.refreshEvents(self, event_date, sort_order);
        Updater.refreshAmResults(self);
        Updater.updateTabLabel(self, true);

        if (param_count === 0) return;

        setTimeout(function() {
            ModalDialog.showParameters(self, rowIndex, TABLE_EVENT);
        }, 500);
    }

    /**
     * Focus the event grid and the last focused cell.
     * @param {object} tab Tab object.
     */    
    static focusEventGrid(tab) {   
        tab.grdEvent.focus();
        if (!tab.lastFocusedColDef) return;

        tab.grdEventOptions.api.setFocusedCell(tab.lastFocusedRowIndex, tab.lastFocusedColumn);
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
     * Refresh events.
     * @param {object} self Self object.
     * @param {string} eventDate Date or null.
     * @param {number} sortOrder Sort order.
     * @return {number} The event row index.
     */
     static refreshEvents(self, eventDate, sortOrder) {
        let tab = self.tabs[self.activeTabIndex];
        tab.grdEventOptions.api.stopEditing();
        tab.grdEventOptions.api.clearFocusedCell();

        tab.eventValues = JSON.parse(self.engine.table_values(self.activeTabIndex, TABLE_EVENT));        

        tab.grdEventOptions.api.setRowData(tab.eventValues);  

        let rowIndex = self.engine.get_event_by_date(self.activeTabIndex, eventDate, sortOrder);

        let column = null;
        if (tab.lastFocusedColDef) {
            column = tab.lastFocusedColumn;
        } else {
            column = tab.grdEventOptions.columnApi.getColumn("Date");
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
     * Refresh status line.
     * @param {object} self Self object.
     */
     static refreshStatusLine(self) {
        let divStatus = document.getElementById("divStatus");

        divStatus.innerText = self.engine.get_cashflow_status(
            self.activeTabIndex, self.tabs[self.activeTabIndex].status);  
    }
                    
    /**
     * Update the tab label.
     * @param {bool} savePending Save pending.
     */    
     static updateTabLabel(self, savePending) {
        if (self.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
        tab.savePending = savePending;

        let spanLabel = tab.divTab.querySelector(".tabLabel");
        spanLabel.innerHTML = tab.label + (savePending ? "*" : "") + " ";
    }
}

/**
 * Modal dialog helper class.
 */
class ModalDialog {

    // The modal output function.
    static modalOutputFn = null;
    // The modal final function.
    static modalFinalFn = null;

    /**
     * Initialize the modal dialog events.
     */    
     static modalInit() {
        document.getElementById("modalBody").addEventListener("keyup", e => ModalDialog.modalKeyUp(e));
        document.getElementById("modalClose").addEventListener("click", () => ModalDialog.modalClose(false));
        document.getElementById("modalCancel").addEventListener("click", () => ModalDialog.modalClose(false));
        document.getElementById("modalOK").addEventListener("click", () => ModalDialog.modalClose(true));
    }

    /**
     * Show a modal dialog.
     * @param {string} title The modal dialog title.
     * @param {object} body The modal dialog body.
     * @param {object} options The options structure.
     */    
     static modalShow(title, body, options = {}) {

        let modalTitle = document.getElementById("modalTitle");
        let modalBody = document.getElementById("modalBody");

        modalTitle.innerHTML = title;
        modalBody.innerHTML = body;

        ModalDialog.modalOutputFn = options.outputFn;
        ModalDialog.modalFinalFn = options.finalFn;

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

        if (options.inputFn) {
            options.inputFn(options.inputData);
        }
    }

    /**
     * Close the currently open modal dialog.
     * @param {bool} isOK The OK button was pressed.
     */    
     static modalClose(isOK) {

        let result = null;
        if (ModalDialog.modalOutputFn) {
            result = ModalDialog.modalOutputFn(isOK);
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

        let finalFn = ModalDialog.modalFinalFn;

        ModalDialog.modalOutputFn = null;
        ModalDialog.modalFinalFn = null;

        if (finalFn) {
            result = finalFn(isOK, result); // A recursive call to modalShow can be done here
        }
    }

    /**
     * Respond to the modal dialog key up.
     * @param {object} e Event object.
     */    
    static modalKeyUp(e) {

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

        ModalDialog.modalShow(chartDef.description, body, { 
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
     * @param {number} index The tab index.
     */    
     static showConfirm(self, text, confirmFn, index) {

        ModalDialog.modalShow("Confirmation", text, { 
            textCancel: "No",
            textOK: "Yes",
            finalFn: (isOK) => {
                if (!isOK) return;
                confirmFn(self, index);
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
                    <strong>Group</strong>
                </div>
                <div class="col-2">
                    <strong>Name</strong>
                </div>
                <div class="col-1">
                    <strong>Type</strong>
                </div>
                <div class="col-1">
                    <strong>Code</strong>
                </div>
                <div class="col-5">
                    <strong>Value</strong>
                </div>
                <div class="col-1">
                    <strong>Prop</strong>
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

        ModalDialog.modalShow("Descriptor List", body, { largeModal: true });    
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
            ModalDialog.modalShow("Current Value", 
                `<div class="row">
                    <div class="col-6">
                        <label for="cvEom" class="col-form-label">Eom</label>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="cvEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="cvPassive" class="col-form-label">Passive</label>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="cvPassive" ${ext["passive"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="cvPresent" class="col-form-label">Present</label>
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
            ModalDialog.modalShow("Interest Change", 
                `<div class="row">
                    <div class="col-6">
                        <label for="icMethod" class="col-form-label">Method</label>
                    </div>
                    <div class="col-6">
                        <select id="icMethod" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option ${ext["interest-method"] === 'actuarial' ? 'selected' : ''}>actuarial</option>
                            <option ${ext["interest-method"] === 'simple-interest' ? 'selected' : ''}>simple-interest</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icDayCount" class="col-form-label">Day count</label>
                    </div>
                    <div class="col-6">
                        <select id="icDayCount" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option ${ext["day-count-basis"] === 'periodic' ? 'selected' : ''}>periodic</option>
                            <option ${ext["day-count-basis"] === 'rule-of-78' ? 'selected' : ''}>rule-of-78</option>
                            <option ${ext["day-count-basis"] === 'actual-actual-isma' ? 'selected' : ''}>actual-actual-isma</option>
                            <option ${ext["day-count-basis"] === 'actual-actual-afb' ? 'selected' : ''}>actual-actual-afb</option>
                            <option ${ext["day-count-basis"] === 'up' ? 'selected' : ''}>up</option>
                            <option ${ext["day-count-basis"] === 'actual-365L' ? 'selected' : ''}>actual-365L</option>
                            <option ${ext["day-count-basis"] === '30' ? 'selected' : ''}>30</option>
                            <option ${ext["day-count-basis"] === '30E' ? 'selected' : ''}>30E</option>
                            <option ${ext["day-count-basis"] === '30EP' ? 'selected' : ''}>30EP</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icDaysInYear" class="col-form-label">Days in year</label>
                    </div>
                    <div class="col-6">
                        <input type="text" id="icDaysInYear" class="form-control form-control-sm" value="${ext["days-in-year"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icEffFreq" class="col-form-label">Effective frequency</label>
                    </div>
                    <div class="col-6">
                        <select id="icEffFreq" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option ${ext["effective-frequency"] === 'none' ? 'selected' : ''}>none</option>
                            <option ${ext["effective-frequency"] === '1-year' ? 'selected' : ''}>1-year</option>
                            <option ${ext["effective-frequency"] === '6-months' ? 'selected' : ''}>6-months</option>
                            <option ${ext["effective-frequency"] === '4-months' ? 'selected' : ''}>4-months</option>
                            <option ${ext["effective-frequency"] === '3-months' ? 'selected' : ''}>3-months</option>
                            <option ${ext["effective-frequency"] === '2-months' ? 'selected' : ''}>2-months</option>
                            <option ${ext["effective-frequency"] === '1-month' ? 'selected' : ''}>1-months</option>
                            <option ${ext["effective-frequency"] === 'half-month' ? 'selected' : ''}>half-month</option>
                            <option ${ext["effective-frequency"] === '4-weeks' ? 'selected' : ''}>4-weeks</option>
                            <option ${ext["effective-frequency"] === '2-weeks' ? 'selected' : ''}>2-weeks</option>
                            <option ${ext["effective-frequency"] === '1-week' ? 'selected' : ''}>1-week</option>
                            <option ${ext["effective-frequency"] === '1-day' ? 'selected' : ''}>1-day</option>
                            <option ${ext["effective-frequency"] === 'continuous' ? 'selected' : ''}>continuous</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icIntFreq" class="col-form-label">Interest frequency</label>
                    </div>
                    <div class="col-6">
                        <select id="icIntFreq" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option ${ext["interest-frequency"] === 'none' ? 'selected' : ''}>none</option>
                            <option ${ext["interest-frequency"] === '1-year' ? 'selected' : ''}>1-year</option>
                            <option ${ext["interest-frequency"] === '6-months' ? 'selected' : ''}>6-months</option>
                            <option ${ext["interest-frequency"] === '4-months' ? 'selected' : ''}>4-months</option>
                            <option ${ext["interest-frequency"] === '3-months' ? 'selected' : ''}>3-months</option>
                            <option ${ext["interest-frequency"] === '2-months' ? 'selected' : ''}>2-months</option>
                            <option ${ext["interest-frequency"] === '1-month' ? 'selected' : ''}>1-months</option>
                            <option ${ext["interest-frequency"] === 'half-month' ? 'selected' : ''}>half-month</option>
                            <option ${ext["interest-frequency"] === '4-weeks' ? 'selected' : ''}>4-weeks</option>
                            <option ${ext["interest-frequency"] === '2-weeks' ? 'selected' : ''}>2-weeks</option>
                            <option ${ext["interest-frequency"] === '1-week' ? 'selected' : ''}>1-week</option>
                            <option ${ext["interest-frequency"] === '1-day' ? 'selected' : ''}>1-day</option>
                            <option ${ext["interest-frequency"] === 'continuous' ? 'selected' : ''}>continuous</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icRoundBal" class="col-form-label">Round balance</label>
                    </div>
                    <div class="col-6">
                        <select id="icRoundBal" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option ${ext["round-balance"] === 'none' ? 'selected' : ''}>none</option>
                            <option ${ext["round-balance"] === 'bankers' ? 'selected' : ''}>bankers</option>
                            <option ${ext["round-balance"] === 'bias-up' ? 'selected' : ''}>bias-up</option>
                            <option ${ext["round-balance"] === 'bias-down' ? 'selected' : ''}>bias-down</option>
                            <option ${ext["round-balance"] === 'up' ? 'selected' : ''}>up</option>
                            <option ${ext["round-balance"] === 'truncate' ? 'selected' : ''}>truncate</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icRoundDD" class="col-form-label">Round decimal digits</label>
                    </div>
                    <div class="col-6">
                        <input type="text" id="icRoundDD" class="form-control form-control-sm" value="${ext["round-decimal-digits"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>`,
                options
            );
            return;
        }
        
        if ("statistic-value" in extension) {
            let ext = extension["statistic-value"];
            ModalDialog.modalShow("Statistic Value", 
                `<div class="row">
                    <div class="col-6">
                        <label for="svName" class="col-form-label">Name</label>
                    </div>
                    <div class="col-6">
                        <input type="text" id="svName" class="form-control form-control-sm" value="${ext["name"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="svEom" class="col-form-label">Eom</label>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="svEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="svFinal" class="col-form-label">Final</label>
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
        ModalDialog.modalShow("Principal Change", 
            `<div class="row">
                <div class="col-6">
                    <label for="pcType" class="col-form-label">Type</label>
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
                    <label for="pcEom" class="col-form-label">Eom</label>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcPrinFirst" class="col-form-label">Principal first</label>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcPrinFirst" ${ext["principal-first"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcBalStats" class="col-form-label">Balance statistics</label>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcBalStats" ${ext["statistics"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcAuxiliary" class="col-form-label">Auxiliary</label>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcAuxiliary" ${ext["auxiliary"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcAuxPassive" class="col-form-label">Auxiliary passive</label>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcAuxPassive" ${ext["passive"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>`,
            options
        );
    }
    
    /**
     * Event type output callback.
     * @param {object} self Self object.
     * @param {number} rowIndex Event row index.
     */
    static showExtensionOutput(self, rowIndex) {
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
            ext["interest-method"] = icMethod.options[icMethod.selectedIndex].text;

            let icDayCount = document.getElementById("icDayCount");
            ext["day-count-basis"] = icDayCount.options[icDayCount.selectedIndex].text;

            let icDaysInYear = document.getElementById("icDaysInYear");
            let val = parseInt(icDaysInYear.value);
            ext["days-in-year"] = isNaN(val) ? "0" : val.toString();

            let icEffFreq = document.getElementById("icEffFreq");
            ext["effective-frequency"] = icEffFreq.options[icEffFreq.selectedIndex].text;

            let icIntFreq = document.getElementById("icIntFreq");
            ext["interest-frequency"] = icIntFreq.options[icIntFreq.selectedIndex].text;

            let icRoundBal = document.getElementById("icRoundBal");
            ext["round-balance"] = icRoundBal.options[icRoundBal.selectedIndex].text;
                    
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
            ext["principal-type"] = pcType.options[pcType.selectedIndex].text;

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

        let result = self.engine.set_extension_values(self.activeTabIndex, rowIndex, JSON.stringify(extension));        
        if (result.length > 0) {
            row.extension = extension;

            let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(tab.lastFocusedRowIndex);
            gridRow.setDataValue(tab.lastFocusedColDef.col_name, result);

            Updater.refreshAmResults(self);
            Updater.updateTabLabel(self, true);
        }
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

        ModalDialog.modalShow("Insert Event", body, {
            textCancel: "Cancel",
            textOK: "Submit",
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
                    Toast.toastError("Please select a template event");
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
                    <label for="cfName" class="col-form-label">Name</label>
                </div>
                <div class="col-6">
                    <input type="text" id="cfName" class="form-control form-control-sm">
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="cfTemplate" class="col-form-label">Template</label>
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

        ModalDialog.modalShow("New Cashflow", body, {
            textCancel: "Cancel",
            textOK: "Submit",
            outputFn: (isOK) => {
                if (!isOK) return {};

                let cfName = document.getElementById("cfName").value;
                let cfTemplate = document.getElementById("cfTemplate").value;
                
                let valid = cfName.length > 0 && cfTemplate.length > 0;
                if (!valid) {
                    Toast.toastError("Please enter a name and select a cashflow template");
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

        let body = "";
            `<div class="row">
                <div class="col-4">
                    <strong>Name</strong>
                </div>
                <div class="col-4">
                    <strong>Type</strong>
                </div>
                <div class="col-4">
                    <strong>Value</strong>
                </div>
            </div>`;

        let list = self.engine.parse_parameters(self.activeTabIndex, rowIndex, tableType);

        for (let elem of list) {
            body +=
                `<div class="row">
                    <div class="col-4">
                        ${elem.name}
                    </div>
                    <div class="col-4">
                        <select id="pcType" class="form-select form-select-sm" disabled>
                            <option ${elem.sym_type === 'integer' ? 'selected' : ''}>integer</option>
                            <option ${elem.sym_type === 'decimal' ? 'selected' : ''}>decimal</option>
                            <option ${elem.sym_type === 'string' ? 'selected' : ''}>string</option>
                        </select>
                    </div>
                    <div class="col-4">
                        <input type="text" class="form-control form-control-sm parameter" 
                            value="${elem.sym_type === 'integer' ? elem.int_value : elem.sym_type === 'decimal' ? elem.dec_value : elem.str_value}" 
                            ${enable ? '' : 'disabled'}>
                    </div>
                </div>`;       
        }

        ModalDialog.modalShow("Parameter List", body, {
            textCancel: enable ? "Cancel" : "",
            textOK: enable ? "Submit" : "OK",
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
                    Updater.updateTabLabel(self, true);        
                }
            }
        });
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
        let intervals = parseInt(self.engine.format_integer_in(row["Intervals"]));
        let eom = Updater.getEom(self, rowIndex, tableType);
        let skipPeriods = row["Skip-periods"];

        let body = `
            <div class="row">
                <div class="col-10">
                    <input type="range" class="form-range" min="0" max="128" value="${skipPeriods.length}" id="skipPeriodsRange"  ${enable ? '' : 'disabled'}>
                </div>
                <div class="col-2">
                    <input class="max-width" type="number" value="${skipPeriods.length}" id="skipPeriodsRangeValue"  ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div id="divSkipPeriods"></div>
        `;        

        let skipPeriodsChangeInfo = {
            startDate: startDate,
            frequency: frequency,
            intervals: intervals,
            eom: eom,
            skipPeriods: skipPeriods,
            newValue: skipPeriods.length,
            tableType: tableType
        };

        ModalDialog.modalShow("Skip Periods", body, {
            textCancel: "Cancel",
            textOK: "Submit",
            inputFn: (inputData) => {
                ModalDialog.showSkipPeriodsRangeChange(inputData.self, skipPeriodsChangeInfo, true);

                document.getElementById("skipPeriodsRange").addEventListener("input", (e) => {
                    skipPeriodsChangeInfo.newValue = e.target.value;
                    
                    let rangeValue = document.getElementById("skipPeriodsRangeValue");
                    rangeValue.value = skipPeriodsChangeInfo.newValue;

                    ModalDialog.showSkipPeriodsRangeChange(inputData.self, skipPeriodsChangeInfo);
                });    

                document.getElementById("skipPeriodsRangeValue").addEventListener("change", (e) => {
                    skipPeriodsChangeInfo.newValue = e.target.value;
                    
                    let range = document.getElementById("skipPeriodsRange");
                    range.value = skipPeriodsChangeInfo.newValue;

                    ModalDialog.showSkipPeriodsRangeChange(inputData.self, skipPeriodsChangeInfo);
                });    
            },
            inputData: {
                self: self
            },
            outputFn: (isOK) => {
                document.getElementById("skipPeriodsRange").removeEventListener("input", (e) => {});
                document.getElementById("skipPeriodsRangeValue").addEventListener("change", (e) => {});
    
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
                if (!isOK || !data.skipPeriods) return;

                skipPeriodsChangeInfo.skipPeriods = data.skipPeriods;

                let tokens = self.engine.set_event_value(
                    colDef.col_name_index, colDef.col_type, colDef.code,
                    self.activeTabIndex, rowIndex, skipPeriodsChangeInfo.skipPeriods).split('|');

                if (tokens.length === 3) {       
                    let value = tokens[2];

                    let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(tab.lastFocusedRowIndex);
                    gridRow.setDataValue(tab.lastFocusedColDef.col_name, value);

                    Updater.refreshAmResults(self);
                    Updater.updateTabLabel(self, true);
                }
            }
        });    
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

            newDate = self.engine.date_new(
                skipPeriodsChangeInfo.startDate, newDate, skipPeriodsChangeInfo.frequency, 
                skipPeriodsChangeInfo.intervals, skipPeriodsChangeInfo.eom);
        }

        document.getElementById("divSkipPeriods").innerHTML = str;
    }

    /**
     * Show a cashflow summary in a modal dialog.
     * @param {object} summary The summary list to show.
     */    
     static showSummary(summary) {
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

        ModalDialog.modalShow("Cashflow Summary", body);
    }
}

/**
 * Toast helper class.
 */
class Toast {

    /**
     * Show a toast message.
     * @param {string} text The text to show in the toast.
     * @param {string} backgroundColor The toast's background color.
     */    
     static toast(text, backgroundColor) {
        Toastify({
            text: text,
            duration: 3000, 
            newWindow: true,
            close: true,
            gravity: "bottom",
            position: "right",
            backgroundColor: backgroundColor,
            stopOnFocus: true
        }).showToast();
    }

    /**
     * Show an informational toast message.
     * @param {string} text The text to show in the toast.
     */    
     static toastInfo(text) {
        Toast.toast(text, "linear-gradient(to right, Blue, DarkBlue)");
    }

    /**
     * Show an error toast message.
     * @param {string} text The text to show in the toast.
     */    
     static toastError(text) {
        Toast.toast(text, "linear-gradient(to right, Red, DarkRed)");
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
            this.eButton.removeEventListener("click", e => this.eventListener(e));
        }
    }

    /**
     * Respond to the button click event.
     * @param {object} callback The callback function.
     * @param {object} self The caller's scope.
     * @param {number} rowIndex The row index.
     * @param {numbert} gridType The type of grid.
     */    
     eventListener(callback, self, rowIndex, gridType) {
        if (!callback) return;
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
            params.callback, params.self, params.rowIndex, params.gridType));
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