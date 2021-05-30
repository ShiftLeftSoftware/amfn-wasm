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
function createChartLineDataSet(self, tab, name, format, accum, color, colorBk, fill, useCFLabels) {
    let data = [];
    let value = null;

    for (let row of tab.amValues.expanded) {
        let date = null;
        for (let key in row) {
            if (key === constant.FIELD_DATE) {
                date = new Date(self.engine.format_date_in(row[key]));
                break;
            }
        }

        let val = null;
        for (let key in row) {
            if (key === name) {
                switch (format) {
                    case constant.FORMAT_DATE:
                        val = new Date(self.engine.format_date_in(row[key]));
                        break;
                    case constant.FORMAT_INTEGER:
                        val = parseInt(self.engine.format_integer_in(row[key]));
                        break;
                    case constant.FORMAT_DECIMAL:
                        // Approximate for charting
                        val = parseFloat(self.engine.format_decimal_in(row[key]));
                        break;
                    case constant.FORMAT_CURRENCY:                    
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
            case constant.FORMAT_INTEGER:
            case constant.FORMAT_DECIMAL:
            case constant.FORMAT_CURRENCY: 
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
 function createChartLineDataSets(inputData, index, useCFLabels) {
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
        
        datasets.push(createChartLineDataSet(self, tab, name, format, accum, color, colorBk, fill, useCFLabels));
        
        ++inputData.dsIndex;
    }

    return datasets;
}

/**
 * Create chart line structure.
 * @param {object} inputData The inputData structure.
 * @return {object} The resulting structure.
 */    
 export function inputChartFn(inputData) {
    let self = inputData.self;
    let dataSets = [];
    inputData.dsIndex = 0;

    if (!inputData.chartDef.allCashflows) {
        dataSets = createChartLineDataSets(inputData, self.activeTabIndex, false);
    } else {
        for (let index = 0; index < self.tabs.length; ++index) {
            for (let ds of createChartLineDataSets(inputData, index, true)) {
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
 export function loadChartDefs(chartDefs) {

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