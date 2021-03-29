/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

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
 * Parse functions class.
 */
class ParseFn {

    /**
     * Fill leading zeros for a number.
     * @param {number} number The number to zero fill.
     * @param {number} size The number of digits.
     * @return {string} The resulting zero filled string.
     */    
     static zerofill(number, size) {
        number = number.toString();
        while (number.length < size) number = "0" + number;
        return number;
    }
    
    /**
     * Parse a date and return the internal format.
     * @param {object} tab The tab structure.
     * @param {string} display_val The display value.
     * @return {string} The resulting date string.
     */    
     static parse_date(tab, display_val) {
        let regexStr = tab.localeFormat.date_regex;
        let replaceStr = tab.localeFormat.date_replace;
        
        let regex = new RegExp(regexStr);

        let dd = display_val.replace(regex, replaceStr).split('-');
        if (dd.length != 3) return new Date();

        return ParseFn.zerofill(dd[0], 4) + "-" + ParseFn.zerofill(dd[1], 2) + "-" + ParseFn.zerofill(dd[2], 2);
    }

    /**
     * Parse an integer and return the internal format.
     * @param {object} tab The tab structure.
     * @param {string} display_val The display value.
     * @return {string} The resulting integer string.
     */    
     static parse_integer(tab, display_val) {
        let regex = tab.localeFormat.integer_regex;
        let replaceStr = tab.localeFormat.integer_replace;

        return display_val.replace(regex, replaceStr);
    }

    /**
     * Parse a decimal and return the internal format.
     * @param {object} tab The tab structure.
     * @param {string} display_val The display value.
     * @return {string} The resulting decimal string.
     */    
     static parse_decimal(tab, display_val) {
        let regex = tab.localeFormat.decimal_regex;
        let replaceStr = tab.localeFormat.decimal_replace;

        return display_val.replace(regex, replaceStr);
    }

    /**
     * Parse a currency and return the internal format.
     * @param {object} tab The tab structure.
     * @param {string} display_val The display value.
     * @return {string} The resulting currency string.
     */    
     static parse_currency(tab, display_val) {
        let regex = tab.localeFormat.currency_regex;
        let replaceStr = tab.localeFormat.currency_replace;

        return display_val.replace(regex, replaceStr);
    }
}

/**
 * Chart utility class.
 */
class ChartUtility {

    /**
     * Create a chart line dataset.
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
     static createChartLineDataSet(tab, name, format, accum, color, colorBk, fill, useCFLabels) {
        let data = [];
        let value = null;

        for (let row of tab.amValues.expanded) {
            let date = null;
            for (let key in row) {
                if (key === "Date") {
                    date = new Date(ParseFn.parse_date(tab, row[key]));
                    break;
                }
            }

            let val = null;
            for (let key in row) {
                if (key === name) {
                    switch (format) {
                        case FORMAT_DATE:
                            val = new Date(ParseFn.parse_date(tab, row[key]));
                            break;
                        case FORMAT_INTEGER:
                            val = parseInt(ParseFn.parse_integer(tab, row[key]));
                            break;
                        case FORMAT_DECIMAL:
                            // Approximate for charting
                            val = parseFloat(ParseFn.parse_decimal(tab, row[key]));
                            break;
                        case FORMAT_CURRENCY:                    
                            // Approximate for charting
                            val = parseFloat(ParseFn.parse_currency(tab, row[key]));
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
     * @param {object} options The options structure.
     * @param {number} index The tab index.
     * @param {bool} useCFLabels Use the cashflow labels 
     *      (for multiple cashflow charts).
     * @return {object} The resulting datasets.
     */    
     static createChartLineDataSets(options, index, useCFLabels) {
        let tab = options.tabs[index];
        let chartDef = options.chartDef
        let colorOffset = chartDef.colorOffset;
        let fill = chartDef.fill;
        let datasets = [];

        for (let column of chartDef.columns) {
            let name = column.name;
            let accum = column.accumulate;
            let color = chartColors[(options.dsIndex + colorOffset) % chartColors.length].medium;
            let colorBk = chartColors[(options.dsIndex + colorOffset) % chartColors.length].light;

            let amColumns = options.tabs[index].amColumns;
            let colIndex = 0;
            for (; colIndex < amColumns.length; ++colIndex) {
                if (name === amColumns[colIndex].col_name) break;
            }

            if (colIndex >= amColumns.length) continue;

            let format = tab.amColumns[colIndex].format;
            
            datasets.push(ChartUtility.createChartLineDataSet(tab, name, format, accum, color, colorBk, fill, useCFLabels));
            
            ++options.dsIndex;
        }

        return datasets;
    }

    /**
     * Create chart line structure.
     * @param {object} options The options structure.
     * @return {object} The resulting structure.
     */    
    static inputChartFn(options) {
        let dataSets = [];
        options.dsIndex = 0;

        if (!options.chartDef.allCashflows) {
            dataSets = ChartUtility.createChartLineDataSets(options, options.activeTabIndex, false);
        } else {
            for (let index = 0; index < options.tabs.length; ++index) {
                for (let ds of ChartUtility.createChartLineDataSets(options, index, true)) {
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
                    if (def.length != 2) continue;
    
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
 * Modal dialog helper class.
 */
class ModalDialog {

    // The modal output function.
    static modalOutputFn = null;

    /**
     * Initialize the modal dialog events.
     */    
     static modalInit() {
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

        let divBackground = document.getElementById("divBackground");
        let divModal = document.getElementById("divModal");

        divBackground.style.display = "none";
        divModal.style.display = "none";

        let modalTitle = document.getElementById("modalTitle");
        let modalBody = document.getElementById("modalBody");

        let result = null;
        if (ModalDialog.modalOutputFn) {
            result = ModalDialog.modalOutputFn(isOK);
        }

        ModalDialog.modalOutputFn = null;
        modalTitle.innerHTML = "";
        modalBody.innerHTML = "";

        return result;
    }

    /**
     * Show a chart in a modal dialog.
     * @param {number} activeTabIndex The active tab index.
     * @param {object} tabs The tabs structure.
     * @param {object} chartDef The chart definition.
     */    
     static showChart(activeTabIndex, tabs, chartDef) {
        let body =
            `<canvas id="canvasChart" class="max-element"></canvas>`;

        ModalDialog.modalShow(chartDef.description, body, { 
            largeModal: true,
            inputFn: ChartUtility.inputChartFn,
            inputData: {
                activeTabIndex: activeTabIndex,
                tabs: tabs,
                chartDef: chartDef
            } 
        });    
    }

    /**
     * Show a descriptor list in a modal dialog.
     * @param {object} engine The engine object.
     * @param {number} activeTabIndex The active tab index.
     * @param {number} rowIndex The row index.
     * @param {number} tableType The tyep of table.
     */    
     static showDescriptors(engine, activeTabIndex, rowIndex, tableType) {
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

        let list = engine.parse_descriptors(activeTabIndex, rowIndex, tableType);
        
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
     * @param {object} extension The extension to show.
     */    
     static showExtension(extension) {
        switch (extension.Type) {
            case "CurrentValue":
                ModalDialog.modalShow("Current Value", 
                    `<div class="row">
                        <div class="col-6">
                            <label for="cvEom" class="col-form-label">Eom</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="cvEom" ${extension.Eom === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="cvPassive" class="col-form-label">Passive</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="cvPassive" ${extension.Passive === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="cvPresent" class="col-form-label">Present</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="cvPresent" ${extension.Present === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>`
                );
                break;
            case "InterestChange":
                ModalDialog.modalShow("Interest Change", 
                    `<div class="row">
                        <div class="col-6">
                            <label for="icMethod" class="col-form-label">Method</label>
                        </div>
                        <div class="col-6">
                            <select id="icMethod" class="form-select form-select-sm" disabled>
                                <option ${extension.Method === 'actuarial' ? 'selected' : ''}>actuarial</option>
                                <option ${extension.Method === 'simple-interest' ? 'selected' : ''}>simple-interest</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icDayCount" class="col-form-label">Day count</label>
                        </div>
                        <div class="col-6">
                            <select id="icDayCount" class="form-select form-select-sm" disabled>
                                <option ${extension.DayCount === 'periodic' ? 'selected' : ''}>periodic</option>
                                <option ${extension.DayCount === 'rule-of-78' ? 'selected' : ''}>rule-of-78</option>
                                <option ${extension.DayCount === 'actual-actual-isma' ? 'selected' : ''}>actual-actual-isma</option>
                                <option ${extension.DayCount === 'actual-actual-afb' ? 'selected' : ''}>actual-actual-afb</option>
                                <option ${extension.DayCount === 'up' ? 'selected' : ''}>up</option>
                                <option ${extension.DayCount === 'actual-365L' ? 'selected' : ''}>actual-365L</option>
                                <option ${extension.DayCount === '30' ? 'selected' : ''}>30</option>
                                <option ${extension.DayCount === '30E' ? 'selected' : ''}>30E</option>
                                <option ${extension.DayCount === '30EP' ? 'selected' : ''}>30EP</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icDaysInYear" class="col-form-label">Days in year</label>
                        </div>
                        <div class="col-6">
                            <input type="text" id="icDaysInYear" class="form-control" value="${extension.DaysInYear}" disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icEffFreq" class="col-form-label">Effective frequency</label>
                        </div>
                        <div class="col-6">
                            <select id="icEffFreq" class="form-select form-select-sm" disabled>
                                <option ${extension.EffFreq === 'none' ? 'selected' : ''}>none</option>
                                <option ${extension.EffFreq === '1-year' ? 'selected' : ''}>1-year</option>
                                <option ${extension.EffFreq === '6-months' ? 'selected' : ''}>6-months</option>
                                <option ${extension.EffFreq === '4-months' ? 'selected' : ''}>4-months</option>
                                <option ${extension.EffFreq === '3-months' ? 'selected' : ''}>3-months</option>
                                <option ${extension.EffFreq === '2-months' ? 'selected' : ''}>2-months</option>
                                <option ${extension.EffFreq === '1-month' ? 'selected' : ''}>1-months</option>
                                <option ${extension.EffFreq === 'half-month' ? 'selected' : ''}>half-month</option>
                                <option ${extension.EffFreq === '4-weeks' ? 'selected' : ''}>4-weeks</option>
                                <option ${extension.EffFreq === '2-weeks' ? 'selected' : ''}>2-weeks</option>
                                <option ${extension.EffFreq === '1-week' ? 'selected' : ''}>1-week</option>
                                <option ${extension.EffFreq === '1-day' ? 'selected' : ''}>1-day</option>
                                <option ${extension.EffFreq === 'continuous' ? 'selected' : ''}>continuous</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icIntFreq" class="col-form-label">Interest frequency</label>
                        </div>
                        <div class="col-6">
                            <select id="icIntFreq" class="form-select form-select-sm" disabled>
                                <option ${extension.IntFreq === 'none' ? 'selected' : ''}>none</option>
                                <option ${extension.IntFreq === '1-year' ? 'selected' : ''}>1-year</option>
                                <option ${extension.IntFreq === '6-months' ? 'selected' : ''}>6-months</option>
                                <option ${extension.IntFreq === '4-months' ? 'selected' : ''}>4-months</option>
                                <option ${extension.IntFreq === '3-months' ? 'selected' : ''}>3-months</option>
                                <option ${extension.IntFreq === '2-months' ? 'selected' : ''}>2-months</option>
                                <option ${extension.IntFreq === '1-month' ? 'selected' : ''}>1-months</option>
                                <option ${extension.IntFreq === 'half-month' ? 'selected' : ''}>half-month</option>
                                <option ${extension.IntFreq === '4-weeks' ? 'selected' : ''}>4-weeks</option>
                                <option ${extension.IntFreq === '2-weeks' ? 'selected' : ''}>2-weeks</option>
                                <option ${extension.IntFreq === '1-week' ? 'selected' : ''}>1-week</option>
                                <option ${extension.IntFreq === '1-day' ? 'selected' : ''}>1-day</option>
                                <option ${extension.IntFreq === 'continuous' ? 'selected' : ''}>continuous</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icRoundBal class="col-form-label">Round balance</label>
                        </div>
                        <div class="col-6">
                            <select id="icRoundBal" class="form-select form-select-sm" disabled>
                                <option ${extension.RoundBal === 'none' ? 'selected' : ''}>none</option>
                                <option ${extension.RoundBal === 'bankers' ? 'selected' : ''}>bankers</option>
                                <option ${extension.RoundBal === 'bias-up' ? 'selected' : ''}>bias-up</option>
                                <option ${extension.RoundBal === 'bias-down' ? 'selected' : ''}>bias-down</option>
                                <option ${extension.RoundBal === 'up' ? 'selected' : ''}>up</option>
                                <option ${extension.RoundBal === 'truncate' ? 'selected' : ''}>truncate</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icRoundDD" class="col-form-label">Round decimal digits</label>
                        </div>
                        <div class="col-6">
                            <input type="text" id="icRoundDD" class="form-control" value="${extension.RoundDD}" disabled>
                        </div>
                    </div>`
                );
                break;
            case "StatisticValue":
                ModalDialog.modalShow("Statistic Value", 
                    `<div class="row">
                        <div class="col-6">
                            <label for="svName" class="col-form-label">Name</label>
                        </div>
                        <div class="col-6">
                            <input type="text" id="svName" class="form-control" value="${extension.Name}" disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="svEom" class="col-form-label">Eom</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="svEom" ${extension.Eom === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="svFinal" class="col-form-label">Final</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="svFinal" ${extension.Final === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>`
                );
                break;
            default:
                ModalDialog.modalShow("Principal Change", 
                    `<div class="row">
                        <div class="col-6">
                            <label for="pcType" class="col-form-label">Type</label>
                        </div>
                        <div class="col-6">
                            <select id="pcType" class="form-select form-select-sm" disabled>
                                <option ${extension.PcType === 'positive' ? 'selected' : ''}>positive</option>
                                <option ${extension.PcType === 'negative' ? 'selected' : ''}>negative</option>
                                <option ${extension.PcType === 'increase' ? 'selected' : ''}>increase</option>
                                <option ${extension.PcType === 'decrease' ? 'selected' : ''}>decrease</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="pcEom" class="col-form-label">Eom</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="pcEom" ${extension.Eom === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="pcPrinFirst" class="col-form-label">Principal first</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="pcPrinFirst" ${extension.PrinFirst === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="pcBalStats" class="col-form-label">Balance statistics</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="pcBalStats" ${extension.BalStats === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="pcAuxiliary" class="col-form-label">Auxiliary</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="pcAuxiliary" ${extension.Auxiliary === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="pcAuxPassive" class="col-form-label">Auxiliary passive</label>
                        </div>
                        <div class="col-6">
                            <input class="form-check-input" type="checkbox" value="" id="pcAuxPassive" ${extension.AuxPassive === 'true' ? 'checked' : ''} disabled>
                        </div>
                    </div>`
                );
                break;
        }
    }

    /**
     * Show a parameter list in a modal dialog.
     * @param {object} engine The engine object.
     * @param {number} activeTabIndex The active tab index.
     * @param {number} rowIndex The row index.
     * @param {number} tableType The tyep of table.
     */    
     static showParameters(engine, activeTabIndex, rowIndex, tableType) {
        let body = "";
            `<div class="row">
                <div class="col-4">
                    <strong>Name</strong>
                </div>
                <div class="col-2">
                    <strong>Type</strong>
                </div>
                <div class="col-6">
                    <strong>Value</strong>
                </div>
            </div>`;

        let list = engine.parse_parameters(activeTabIndex, rowIndex, tableType);

        for (let elem of list) {
            body +=
                `<div class="row">
                    <div class="col-4">
                        ${elem.name}
                    </div>
                    <div class="col-2">
                        <select id="pcType" class="form-select form-select-sm" disabled>
                            <option ${elem.sym_type === 'integer' ? 'selected' : ''}>integer</option>
                            <option ${elem.sym_type === 'decimal' ? 'selected' : ''}>decimal</option>
                            <option ${elem.sym_type === 'string' ? 'selected' : ''}>string</option>
                        </select>
                    ${elem.sym_type}
                    </div>
                    <div class="col-6">
                        ${elem.sym_type === 'integer' ? elem.int_value : 
                            elem.sym_type === 'decimal' ? elem.dec_value : elem.str_value}
                    </div>
                </div>`;       
        }

        ModalDialog.modalShow("Parameter List", body);
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
        return params.valueFormatted ? params.valueFormatted : params.value;
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