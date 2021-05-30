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
import * as updater from "./updater";
import * as toaster from "./toaster";

const { WasmElemPreferences } = wasm_bindgen;

/**
 * Modal dialog class.
 */
 export class ModalDialog {    

    constructor() {

        // The modal help group.
        this.modalHelpGroup = "";
        // The modal output function.
        this.modalOutputFn = null;
        // The modal final function.
        this.modalFinalFn = null;

        // The modal temporary help objects.
        this.modalHelpTemps = [];

        // The modal general help object.
        this.modalHelpGeneral = new bootstrap.Popover(document.getElementById("modalHelp"), {
            content: modalHelpContent,
            title: modalHelpTitle,
            customClass: "div-popover",
            html: true
        });

        document.getElementById("divModal").addEventListener("click", e => modalClick(e), true); // Capture
        document.getElementById("modalBody").addEventListener("keyup", e => modalKeyUp(e));
        document.getElementById("modalClose").addEventListener("click", () => modalClose(false));
        document.getElementById("modalCancel").addEventListener("click", () => modalClose(false));
        document.getElementById("modalOK").addEventListener("click", () => modalClose(true));
    }

    /**
     * Show a modal dialog.
     * @param {string} title The modal dialog title.
     * @param {string} helpGroup The modal help group.
     * @param {object} body The modal dialog body.
     * @param {object} options The options structure.
     */    
    modalShow(title, helpGroup, body, options = {}) {

        let modalTitle = document.getElementById("modalTitle");
        let modalBody = document.getElementById("modalBody");

        modalTitle.innerHTML = title;
        modalBody.innerHTML = body;

        this.modalHelpGroup = helpGroup;
        this.modalOutputFn = options.outputFn;
        this.modalFinalFn = options.finalFn;

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

        this.modalHelpTemps = [];
        
        let elems = document.getElementsByClassName("btnHelp");
        for (let elem of elems) {
            this.modalHelpTemps.push(new bootstrap.Popover(elem, {
                content: modalHelpContent,
                title: modalHelpTitle,
                customClass: "div-popover",
                html: true
            }));
        }
        
        elems = document.getElementsByClassName("btnHelpDefault");
        for (let elem of elems) {
            this.modalHelpTemps.push(new bootstrap.Popover(elem, {
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
    modalClose(isOK) {

        this.modalHelpGeneral.hide();

        for (let help of this.modalHelpTemps) {
            help.dispose();
        }

        this.modalHelpTemps = [];

        let result = null;
        if (this.modalOutputFn) {
            result = this.modalOutputFn(isOK);
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

        let finalFn = this.modalFinalFn;

        this.modalHelpGroup = "";
        this.modalOutputFn = null;
        this.modalFinalFn = null;

        if (finalFn) {
            result = finalFn(isOK, result); // A recursive call to modalShow can be done here
        }
    }

    /**
     * Called for help content with a modal dialog.
     */    
    modalHelpContent() {
        let helpGroup = this.modalHelpGroup;
        let helpKey = this.dataset.help;

        let helpElem = null;
        for (let elem of global.config.helpForms) {
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
    modalHelpTitle() {
        let helpGroup = this.modalHelpGroup;
        let helpKey = this.dataset.help;

        return helpGroup + "/" + helpKey;
    }

    /**
     * Create template events, refresh display, and show parameters.
     * @param {object} self Self object.
     * @param {string} event Event name.
     */    
    createTemplateEventsShowParameters(self, event) {           
        
        let paramCount = updater.createTemplateEvents(self, event);
        if (paramCount === 0) return;

        setTimeout(function() {
            showParameters(self, rowIndex, constant.TABLE_EVENT);
        }, 100);
    }

    /**
     * Event type output callback.
     * @param {object} self Self object.
     * @param {number} rowIndex Event row index.
     */
    extensionOutput(self, rowIndex) {
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
    extensionFinal(self, rowIndex, data) {
        if (self.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
        let row = tab.eventValues[rowIndex];
        let extension = data;

        let result = self.engine.set_extension_values(self.activeTabIndex, rowIndex, JSON.stringify(extension));        
        if (result.length > 0) {
            row.extension = extension;

            let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(tab.lastFocused.rowIndex);
            gridRow.setDataValue(tab.lastFocused.colDef.col_name, result);

            updater.refreshAmResults(self);
            updater.updateTabLabel(self, self.activeTabIndex, true);
        }
    }

    /**
     * Respond to the modal click capture event.
     * @param {object} e Event object.
     */    
    modalClick(e) {

        if (e && e.target && (
            e.target.hasAttribute("aria-describedby") || 
            e.target.parentElement && e.target.parentElement.hasAttribute("aria-describedby"))) return;

        this.modalHelpGeneral.hide();

        for (let help of this.modalHelpTemps) {
            help.hide();
        }
    }

    /**
     * Respond to the modal dialog key up.
     * @param {object} e Event object.
     */    
    modalKeyUp(e) {

        if (e.keyCode === 27) { // Escape
            modalClick(null);
            return;
        }

        if (e.keyCode !== 13 || e.shiftKey || e.ctrlKey || e.altKey) return;

        modalClose(true);
    }

    /**
     * Show a chart in a modal dialog.
     * @param {object} self Self object.
     * @param {object} chartDef The chart definition.
     */    
    showChart(self, chartDef) {
        let body =
            `<canvas id="canvasChart" class="max-element"></canvas>`;

        modalShow(chartDef.description, constant.HelpChart, body, { 
            largeModal: true,
            inputFn: chartUtility.inputChartFn,
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
    showConfirm(self, text, confirmFn, cancelFn, index) {

        modalShow(updater.getResource(self, constant.MODAL_CONFIRMATION), constant.HelpConfirm, text, { 
            textCancel: updater.getResource(self, constant.MODAL_NO),
            textOK: updater.getResource(self, constant.MODAL_YES),
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
    showDescriptors(self, rowIndex, tableType) {
        let body =
            `<div class="row">
                <div class="col-2">
                    <strong>${updater.getResource(self, constant.MODAL_DESC_GROUP)}</strong>
                </div>
                <div class="col-2">
                    <strong>${updater.getResource(self, constant.MODAL_DESC_NAME)}</strong>
                </div>
                <div class="col-1">
                    <strong>${updater.getResource(self, constant.MODAL_DESC_TYPE)}</strong>
                </div>
                <div class="col-1">
                    <strong>${updater.getResource(self, constant.MODAL_DESC_CODE)}</strong>
                </div>
                <div class="col-5">
                    <strong>${updater.getResource(self, constant.MODAL_DESC_VALUE)}</strong>
                </div>
                <div class="col-1">
                    <strong>${updater.getResource(self, constant.MODAL_DESC_PROPAGATE)}</strong>
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

        modalShow(updater.getResource(self, constant.MODAL_DESCRIPTOR_LIST), constant.HelpDescriptor, body, { largeModal: true });    
    }

    /**
     * Show an extension in a modal dialog.
     * @param {object} self Self object.
     * @param {number} rowIndex Row index.
     * @param {number} tableType The type of table.
     * @param {object} options The options structure.
     */    
    showExtension(self, rowIndex, tableType, options = {}) {
        let enable = tableType === constant.TABLE_EVENT;
        let extension;

        if (tableType === constant.TABLE_EVENT) {
            extension = self.tabs[self.activeTabIndex].eventValues[rowIndex].extension;
        } else if (self.tabs[self.activeTabIndex].expanded) {
            extension = self.tabs[self.activeTabIndex].amValues.expanded[rowIndex].extension;
        } else {
            extension = self.tabs[self.activeTabIndex].amValues.compressed[rowIndex].extension;
        }
        
        if ("current-value" in extension) {
            let ext = extension["current-value"];
            modalShow(updater.getResource(self, constant.MODAL_CURRENT_VALUE), constant.HelpCurrentValue,
                `<div class="row">
                    <div class="col-6">
                        <label for="cvEom" class="col-form-label">${updater.getResource(self, constant.MODAL_CV_EOM)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="eom"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="cvEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="cvPassive" class="col-form-label">${updater.getResource(self, constant.MODAL_CV_PASSIVE)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="passive"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="cvPassive" ${ext["passive"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="cvPresent" class="col-form-label">${updater.getResource(self, constant.MODAL_CV_PRESENT)}</label>
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
                        <label for="icMethod" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_METHOD)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="interest-method"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icMethod" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="actuarial" ${ext["interest-method"] === 'actuarial' ? 'selected' : ''}>${updater.getResource(self, constant.METHOD_ACTUARIAL)}</option>
                            <option value="simple-interest" ${ext["interest-method"] === 'simple-interest' ? 'selected' : ''}>${updater.getResource(self, constant.METHOD_SIMPLE_INTEREST)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icDayCount" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_DAY_COUNT)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="day-count-basis"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icDayCount" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="periodic" ${ext["day-count-basis"] === 'periodic' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_PERIODIC)}</option>
                            <option value="rule-of-78" ${ext["day-count-basis"] === 'rule-of-78' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_RULE_OF_78)}</option>
                            <option value="actual" ${ext["day-count-basis"] === 'actual' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_ACTUAL)}</option>
                            <option value="actual-actual-isma" ${ext["day-count-basis"] === 'actual-actual-isma' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_ACTUAL_ISMA)}</option>
                            <option value="actual-actual-afb" ${ext["day-count-basis"] === 'actual-actual-afb' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_ACTUAL_AFB)}</option>
                            <option value="actual-365L" ${ext["day-count-basis"] === 'actual-365L' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_ACTUAL_365L)}</option>
                            <option value="30" ${ext["day-count-basis"] === '30' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_30)}</option>
                            <option value="30E" ${ext["day-count-basis"] === '30E' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_30E)}</option>
                            <option value="30EP" ${ext["day-count-basis"] === '30EP' ? 'selected' : ''}>${updater.getResource(self, constant.DAY_COUNT_30EP)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icDaysInYear" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_DAYS_IN_YEAR)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="days-in-year"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input type="text" spellcheck="false" id="icDaysInYear" class="form-control form-control-sm" value="${ext["days-in-year"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icEffFreq" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_EFF_FREQ)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="effective-frequency"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icEffFreq" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="none" ${ext["effective-frequency"] === 'none' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_NONE)}</option>
                            <option value="1-year" ${ext["effective-frequency"] === '1-year' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_YEAR)}</option>
                            <option value="6-months" ${ext["effective-frequency"] === '6-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_6_MONTHS)}</option>
                            <option value="4-months" ${ext["effective-frequency"] === '4-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_4_MONTHS)}</option>
                            <option value="3-months" ${ext["effective-frequency"] === '3-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_3_MONTHS)}</option>
                            <option value="2-months" ${ext["effective-frequency"] === '2-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_2_MONTHS)}</option>
                            <option value="1-month" ${ext["effective-frequency"] === '1-month' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_MONTH)}</option>
                            <option value="half-month" ${ext["effective-frequency"] === 'half-month' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_HALF_MONTH)}</option>
                            <option value="4-weeks" ${ext["effective-frequency"] === '4-weeks' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_4_WEEKS)}</option>
                            <option value="2-weeks" ${ext["effective-frequency"] === '2-weeks' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_2_WEEKS)}</option>
                            <option value="1-week" ${ext["effective-frequency"] === '1-week' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_WEEK)}</option>
                            <option value="1-day" ${ext["effective-frequency"] === '1-day' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_DAY)}</option>
                            <option value="continuous" ${ext["effective-frequency"] === 'continuous' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_CONTINUOUS)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icIntFreq" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_INT_FREQ)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="interest-frequency"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icIntFreq" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                        <option value="none" ${ext["interest-frequency"] === 'none' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_NONE)}</option>
                        <option value="1-year" ${ext["interest-frequency"] === '1-year' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_YEAR)}</option>
                        <option value="6-months" ${ext["interest-frequency"] === '6-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_6_MONTHS)}</option>
                        <option value="4-months" ${ext["interest-frequency"] === '4-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_4_MONTHS)}</option>
                        <option value="3-months" ${ext["interest-frequency"] === '3-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_3_MONTHS)}</option>
                        <option value="2-months" ${ext["interest-frequency"] === '2-months' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_2_MONTHS)}</option>
                        <option value="1-month" ${ext["interest-frequency"] === '1-month' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_MONTH)}</option>
                        <option value="half-month" ${ext["interest-frequency"] === 'half-month' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_HALF_MONTH)}</option>
                        <option value="4-weeks" ${ext["interest-frequency"] === '4-weeks' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_4_WEEKS)}</option>
                        <option value="2-weeks" ${ext["interest-frequency"] === '2-weeks' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_2_WEEKS)}</option>
                        <option value="1-week" ${ext["interest-frequency"] === '1-week' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_WEEK)}</option>
                        <option value="1-day" ${ext["interest-frequency"] === '1-day' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_1_DAY)}</option>
                        <option value="continuous" ${ext["interest-frequency"] === 'continuous' ? 'selected' : ''}>${updater.getResource(self, constant.FREQ_CONTINUOUS)}</option>
                    </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icRoundBal" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_ROUND_BAL)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="round-balance"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <select id="icRoundBal" class="form-select form-select-sm" ${enable ? '' : 'disabled'}>
                            <option value="none" ${ext["round-balance"] === 'none' ? 'selected' : ''}>${updater.getResource(self, constant.ROUNDING_NONE)}</option>
                            <option value="bankers" ${ext["round-balance"] === 'bankers' ? 'selected' : ''}>${updater.getResource(self, constant.ROUNDING_BANKERS)}</option>
                            <option value="bias-up" ${ext["round-balance"] === 'bias-up' ? 'selected' : ''}>${updater.getResource(self, constant.ROUNDING_BIAS_UP)}</option>
                            <option value="bias-down" ${ext["round-balance"] === 'bias-down' ? 'selected' : ''}>${updater.getResource(self, vROUNDING_BIAS_DOWN)}</option>
                            <option value="up" ${ext["round-balance"] === 'up' ? 'selected' : ''}>${updater.getResource(self, constant.ROUNDING_UP)}</option>
                            <option value="truncate" ${ext["round-balance"] === 'truncate' ? 'selected' : ''}>${updater.getResource(self, constant.ROUNDING_TRUNCATE)}</option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="icRoundDD" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_ROUND_DD)}</label>
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
                            <label for="icStatNar" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_STAT_NAR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="nominal-annual-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatNar class="form-control form-control-sm" value="${stat["nar"]}" disabled>                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icStatEar" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_STAT_EAR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="effective-annual-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatEar class="form-control form-control-sm" value="${stat["ear"]}" disabled>                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icStatPr" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_STAT_PR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="periodic-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatPr class="form-control form-control-sm" value="${stat["pr"]}" disabled>                            
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="icStatDr" class="col-form-label">${updater.getResource(self, constant.MODAL_IC_STAT_DR)}</label>
                            <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="daily-rate"><i class="bi-question-circle"></i></a>
                        </div>
                        <div class="col-6">
                            <input type="text" spellcheck="false" id="icStatDr class="form-control form-control-sm" value="${stat["dr"]}" disabled>                            
                        </div>
                    </div>`;
            }

            modalShow(updater.getResource(self, MODAL_INTEREST_CHANGE), constant.HelpInterestChange, form, options);

            return;
        }
        
        if ("statistic-value" in extension) {
            let ext = extension["statistic-value"];
            modalShow(updater.getResource(self, constant.MODAL_STATISTIC_CHANGE), constant.HelpStatisticValue,
                `<div class="row">
                    <div class="col-6">
                        <label for="svName" class="col-form-label">${updater.getResource(self, constant.MODAL_SV_NAME)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="name"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input type="text" spellcheck="false" id="svName" class="form-control form-control-sm" value="${ext["name"]}" ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="svEom" class="col-form-label">${updater.getResource(self, constant.MODAL_SV_EOM)}</label>
                        <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="eom"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input class="form-check-input" type="checkbox" id="svEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                    </div>
                </div>
                <div class="row">
                    <div class="col-6">
                        <label for="svFinal" class="col-form-label">${updater.getResource(self, constant.MODAL_SV_FINAL)}</label>
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
        modalShow(updater.getResource(self, constant.MODAL_PRINCIPAL_CHANGE), constant.HelpPrincipalChange,
            `<div class="row">
                <div class="col-6">
                    <label for="pcType" class="col-form-label">${updater.getResource(self, constant.MODAL_PC_TYPE)}</label>
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
                    <label for="pcEom" class="col-form-label">${updater.getResource(self, constant.MODAL_PC_EOM)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="eom"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcEom" ${ext["eom"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcPrinFirst" class="col-form-label">${updater.getResource(self, constant.MODAL_PC_PRIN_FIRST)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="principal-first"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcPrinFirst" ${ext["principal-first"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcBalStats" class="col-form-label">${updater.getResource(self, constant.MODAL_PC_BAL_STAT)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="statistics"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcBalStats" ${ext["statistics"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcAuxiliary" class="col-form-label">${updater.getResource(self, constant.MODAL_PC_AUXILIARY)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="auxiliary"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input class="form-check-input" type="checkbox" id="pcAuxiliary" ${ext["auxiliary"] === 'true' ? 'checked' : ''} ${enable ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="pcAuxPassive" class="col-form-label">${updater.getResource(self, constant.MODAL_PC_AUX_PASSIVE)}</label>
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
    showInsertEvent(self) {
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

        modalShow(updater.getResource(self, constant.MODAL_INSERT_EVENT), constant.HelpInsertEvent, body, {
            textCancel: updater.getResource(self, constant.MODAL_CANCEL),
            textOK: updater.getResource(self, constant.MODAL_SUBMIT),
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
                    toaster.toastError(updater.getResource(self, constant.MSG_SELECT_TEMPLATE_EVENT));
                    return null;
                }

                return {
                    event: event
                };
            },
            finalFn(isOK, data) {
                if (!isOK || !data.event) return;

                createTemplateEventsShowParameters(self, data.event);
            }
        });
    }

    /**
     * Show a new cashflow modal dialog.
     * @param {object} self Self object.
     */    
    showNewCashflow(self) {

        let templateGroups = self.engine.get_template_names();

        let body = 
            `<div class="row">
                <div class="col-6">
                    <label for="cfName" class="col-form-label">${updater.getResource(self, constant.MODAL_NC_NAME)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="name"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="cfName" class="form-control form-control-sm">
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="cfTemplate" class="col-form-label">${updater.getResource(self, constant.MODAL_NC_TEMPLATE)}</label>
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

        modalShow(updater.getResource(self, constant.MODAL_NEW_CASHFLOW), constant.HelpNewCashflow, body, {
            textCancel: updater.getResource(self, constant.MODAL_CANCEL),
            textOK: updater.getResource(self, constant.MODAL_SUBMIT),
            outputFn: (isOK) => {
                if (!isOK) return {};

                let cfName = document.getElementById("cfName").value;
                let cfTemplate = document.getElementById("cfTemplate").value;
                
                let valid = cfName.length > 0 && cfTemplate.length > 0;
                if (!valid) {
                    toaster.toastError(updater.getResource(self, constant.MSG_SELECT_CASHFLOW_TEMPLATE));
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
                    createTemplateEventsShowParameters(self, initialName);
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
    showParameters(self, rowIndex, tableType) {
        let enable = tableType === constant.TABLE_EVENT;

        let list = self.engine.parse_parameters(self.activeTabIndex, rowIndex, tableType);

        let body = "";
        for (let elem of list) {
            body +=
                `<div class="row">
                    <div class="col-6">
                        ${elem.label.length > 0 ? elem.label : elem.name}
                        <a class="btn btnHelpDefault" role="button" tabindex="-1" data-bs-toggle="popover" title="${updater.getResource(self, constant.MODAL_PARAMETER_LIST)}" data-bs-content="${elem.description}"><i class="bi-question-circle"></i></a>
                    </div>
                    <div class="col-6">
                        <input type="text" spellcheck="false" class="form-control form-control-sm parameter" 
                            value="${elem.sym_type === 'integer' ? elem.int_value : elem.sym_type === 'decimal' ? elem.dec_value : elem.str_value}" 
                            ${enable ? '' : 'disabled'}>
                    </div>
                </div>`; 
        }

        modalShow(updater.getResource(self, constant.MODAL_PARAMETER_LIST), constant.HelpParameter, body, {
            textCancel: enable ? updater.getResource(self, constant.MODAL_CANCEL) : "",
            textOK: enable ? updater.getResource(self, constant.MODAL_SUBMIT) : updater.getResource(self, constant.MODAL_OK),
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
                    updater.refreshAmResults(self);
                    updater.updateTabLabel(self, self.activeTabIndex, true);        
                }
            }
        });
    }

    /**
     * Show a preferences a modal dialog.
     * @param {object} self Self object.
     * @param {number} cfIndex Cashflow index or -1 for user preferences.
     */    
    showPreferences(self, cfIndex) {

        let pref = self.engine.get_preferences(cfIndex);

        modalShow(updater.getResource(self, cfIndex < 0 ? constant.MODAL_USER_PREFERENCES : constant.MODAL_CASHFLOW_PREFERENCES), constant.HelpPreferences,
            `<div class="row">
                <div class="col-6">
                    <label for="prefLocale" class="col-form-label">${updater.getResource(self, constant.MODAL_PREF_LOCALE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="locale-str"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefLocale" class="form-control form-control-sm" value="${pref["locale_str"]}" disabled>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefGroup" class="col-form-label">${updater.getResource(self, constant.MODAL_PREF_GROUP)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="group"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefGroup" class="form-control form-control-sm" value="${pref["group"]}" disabled>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefCrossRate" class="col-form-label">${updater.getResource(self, constant.MODAL_PREF_CROSS_RATE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="cross-rate-code"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefCrossRate" class="form-control form-control-sm" value="${pref["cross_rate_code"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefEncoding" class="col-form-label">${updater.getResource(self, constant.MODAL_PREF_ENCODING)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="default-encoding"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefEncoding" class="form-control form-control-sm" value="${pref["default_encoding"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefFiscalYear" class="col-form-label">${updater.getResource(self, constant.MODAL_PREF_FISCAL_YEAR)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="fiscal-year-start"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="number" id="prefFiscalYear" class="form-control form-control-sm" value="${pref["fiscal_year_start"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefDecimalDigits" class="col-form-label">${updater.getResource(self, constant.MODAL_PREF_DECIMAL_DIGITS)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="decimal-digits"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="number" id="prefDecimalDigits" class="form-control form-control-sm" value="${pref["decimal_digits"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>
            <div class="row">
                <div class="col-6">
                    <label for="prefTargetValue" class="col-form-label">${updater.getResource(self, constant.MODAL_PREF_TARGET_VALUE)}</label>
                    <a class="btn btnHelp" role="button" tabindex="-1" data-bs-toggle="popover" data-help="target-value"><i class="bi-question-circle"></i></a>
                </div>
                <div class="col-6">
                    <input type="text" spellcheck="false" id="prefTargetValue" class="form-control form-control-sm" value="${pref["target"]}" ${cfIndex >= 0 ? '' : 'disabled'}>
                </div>
            </div>`, {
                textCancel: cfIndex >= 0 ? updater.getResource(self, constant.MODAL_CANCEL) : "",
                textOK: cfIndex >= 0 ? updater.getResource(self, constant.MODAL_SUBMIT) : updater.getResource(self, constant.MODAL_OK),
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
                        updater.refreshEvents(self, "", 0);
                        updater.refreshAmResults(self);
                        updater.updateTabLabel(self, self.activeTabIndex, true);        
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
    showSkipPeriods(self, rowIndex, tableType) {
        if (self.activeTabIndex < 0) return;

        let tab = self.tabs[self.activeTabIndex];
        let enable = tableType === constant.TABLE_EVENT;

        let row;
        if (tableType === constant.TABLE_EVENT) {
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
        let eom = updater.getEom(self, rowIndex, tableType);
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

        modalShow(updater.getResource(self, constant.MODAL_SKIP_PERIODS), constant.HelpSkipPeriods, body, {
            textCancel: updater.getResource(self, constant.MODAL_CANCEL),
            textOK: updater.getResource(self, constant.MODAL_SUBMIT),
            inputFn: (inputData) => {
                showSkipPeriodsRangeChange(inputData.self, skipPeriodsChangeInfo, true);

                document.getElementById("skipPeriodsRange").addEventListener("input", 
                    (e) => showSkipPeriodsInput(e, inputData.self, skipPeriodsChangeInfo));    
                document.getElementById("skipPeriodsRangeValue").addEventListener("change", 
                    (e) => showSkipPeriodsChange(e, inputData.self, skipPeriodsChangeInfo));
            },
            inputData: {
                self: self
            },
            outputFn: (isOK) => {
                document.getElementById("skipPeriodsRange").removeEventListener("input", 
                    (e) => showSkipPeriodsInput(e, inputData.self, skipPeriodsChangeInfo));
                document.getElementById("skipPeriodsRangeValue").addEventListener("change", 
                    (e) => showSkipPeriodsChange(e, inputData.self, skipPeriodsChangeInfo));

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

                    updater.refreshAmResults(self);
                    updater.updateTabLabel(self, self.activeTabIndex, true);
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
    showSkipPeriodsInput(e, self, skipPeriodsChangeInfo) {  
        skipPeriodsChangeInfo.newValue = e.target.value;
        
        let rangeValue = document.getElementById("skipPeriodsRangeValue");
        rangeValue.value = skipPeriodsChangeInfo.newValue;

        showSkipPeriodsRangeChange(self, skipPeriodsChangeInfo);
    }    

    /**
     * Respond to the skip periods slider value changing.
     * @param {object} e Change event.
     * @param {object} self Self event.
     * @param {object} skipPeriodsChangeInfo Skip periods change info.
     */    
    showSkipPeriodsChange(e, self, skipPeriodsChangeInfo) {
        skipPeriodsChangeInfo.newValue = e.target.value;
        
        let range = document.getElementById("skipPeriodsRange");
        range.value = skipPeriodsChangeInfo.newValue;

        showSkipPeriodsRangeChange(self, skipPeriodsChangeInfo);
    }
                    
    /**
     * Skip periods range change.
     * @param {object} self Self object.
     * @param {object} skipPeriodsChangeInfo Skip periods change information.
     * @param {bool} isInit Initial skip periods.
     */    
    showSkipPeriodsRangeChange(self, skipPeriodsChangeInfo, isInit = false) {
        let enable = skipPeriodsChangeInfo.tableType === constant.TABLE_EVENT;

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
    showSummary(self, summary) {
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

        modalShow(updater.getResource(self, constant.MODAL_CASHFLOW_SUMMARY), constant.HelpSummary, body);
    }

}