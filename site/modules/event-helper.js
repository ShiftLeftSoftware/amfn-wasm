/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

import { saveAs } from "file-saver";

import * as constant from "./constant";
import * as global from "./global";
import * as updater from "./updater";
import * as toaster from "./toaster";

/**
 * Close the indicated tab function.
 * @param {object} self Self object.
 * @param {number} index The tab index to close.
 */    
export function closeTabFn(self, index) {

    if (!self.engine.remove_cashflow(index)) {
        toaster.toastError(updater.getResource(self, constant.MSG_TAB_INDEX) + index);
        return;
    }

    let lastTab = self.tabs.length < 2;
    if (lastTab) {        
        self.setExpand(false);
    }

    self.tabs[index].grdEvent.removeEventListener("keydown", e => eventKeyDown(self, e));

    self.tabs[index].grdEvent.remove();
    self.tabs[index].grdAm.remove();

    let iPrefs = self.tabs[index].divTab.querySelector(".bi-gear")
    iPrefs.removeEventListener("click", e => self.prefsTabEvent(e));

    let iClose = self.tabs[index].divTab.querySelector(".bi-x")
    iClose.removeEventListener("click", e => self.closeTabEvent(e));

    self.tabs[index].divTab.removeEventListener("click", e => self.activateTabEvent(e));

    let ulTabs = document.getElementById("ulTabs"); 
    ulTabs.children[index].remove();

    self.tabs.splice(index, 1);

    if (!lastTab) {        
        self.tabs[0].divTab.click();        
        return;
    }

    self.enableCashflowMenu(false);

    let secHelp = document.getElementById("secHelp");
    if (secHelp.classList.contains("display-none")) {
        secHelp.classList.remove("display-none");
    }

    updater.clearStatusLine();
}

/**
 * Respond to the event cell focus changing.
 * @param {object} self Self object.
 * @param {object} e Change event.
 */    
export function eventCellFocused(self, e) {
    if (!(e.column && e.column.colDef && e.column.colDef.field)) return;        
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];
    
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

    let enable = field === constant.FIELD_VALUE || field === constant.FIELD_PERIODS;

    self.enableClass("btnDelete", "disabled", true);    
    self.enableClass("btnCalculate", "disabled", enable);    

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
 * @param {object} self Self object.
 * @param {object} e Keydown event.
 */    
export function eventKeyDown(self, e) {
    self.enterKeySeen = false;

    if (!self.engineInitialized() || self.activeTabIndex < 0) return;    

    let tab = self.tabs[self.activeTabIndex];
    if (e.keyCode !== 13 || e.shiftKey || e.ctrlKey || e.altKey || !tab.lastFocused.colDef) return;

    if (tab.lastFocused.value !== // Change event will fire next
        tab.eventValues[tab.lastFocused.rowIndex][tab.lastFocused.colDef.col_name]) {
            self.enterKeySeen = true;
            return;
    }

    updater.focusEventGrid(tab);

    setTimeout(function() {
        if (!tab.grdEventOptions.api.tabToNextCell()) {
            nextInsert(self);
        }
    }, 100);
}

/**
 * Respond to the event grid cell value changing.
 * @param {object} self Self object.
 * @param {object} e Change event.
 */    
export function eventValueChanged(self, e) {
    let enterKeySeen = self.enterKeySeen;
    self.enterKeySeen = false;

    if (!self.engineInitialized() || 
        self.activeTabIndex < 0 || e.oldValue === e.newValue) return;

    let tab = self.tabs[self.activeTabIndex];
    let field = e.column.colDef.field;

    if (tab.lastFocused.value === // Insure we have changed
        tab.eventValues[e.rowIndex][field]) return;

    let colDef = null;
    for (let cd of tab.eventColumns) {
        if (field === cd.col_name) {
            colDef = cd;
            break;
        }
    }        
    if (!colDef) return;

    let tokens = self.engine.set_event_value(
        colDef.col_name_index, colDef.col_type, colDef.code, 
        self.activeTabIndex, e.rowIndex, e.newValue).split('|');
    if (tokens.length !== 3) return;

    let eventDate = tokens[0];
    let sortOrder = parseInt(tokens[1]);
    let value = tokens[2];
    let refreshEvts = false;

    switch (colDef.col_name) {
        case constant.FIELD_DATE: 
            eventDate = value;
            refreshEvts = true;
            break;
        case constant.FIELD_SORT:
            sortOrder = value;
            refreshEvts = true;
            break;
    }

    if (refreshEvts) {
        updater.refreshEvents(self, eventDate, sortOrder);
    } else {
        let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(e.rowIndex);
        gridRow.setDataValue(field, value);    
        updater.focusEventGrid(tab);
    }
            
    setTimeout(function() {        
        if (!refreshEvts && enterKeySeen && e.rowIndex === tab.lastFocused.rowIndex && e.column === tab.lastFocused.column) { 
            if (!tab.grdEventOptions.api.tabToNextCell()) {
                nextInsert(self);
            }
        }

        updater.refreshAmResults(self);
        updater.updateTabLabel(self, self.activeTabIndex, true);
    }, 100);
}

/**
 * Callback for files input.
 * @param {object} self Self object.
 * @param {string} name The file name.
 * @param {object} file The file object.
 */    
export function fileInput(self, name, file) {

    let reader = new FileReader();

    reader.onload = (e) => {   
        let result = self.engine.deserialize(reader.result);
        if (result.length > 0) {
            toaster.toastError(result);
            return;
        }  

        self.loadCashflow(name);
    };

    reader.readAsText(file, global.config.encoding);
}

/**
 * Respond to the menu user preferences event.
 * @param {object} self Self object.
 */    
export function menuUserPreferences(self) {
    if (!self.engineInitialized()) return;

    self.modalDialog.showPreferences(self, -1);
}

/**
 * Respond to the menu close cashflow event.
 * @param {object} self Self object.
 */    
export function menuCloseCashflow(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    self.closeTab(self.activeTabIndex);
}

/**
 * Respond to the menu new cashflow event.
 * @param {object} self Self object.
 */    
export function menuNewCashflow(self) {
    
    if (!self.engineInitialized()) return;
    
    self.modalDialog.showNewCashflow(self);
}

/**
 * Respond to the menu open cashflow event.
 * @param {object} self Self object.
 */    
export function menuOpenCashflow(self) {
    
    if (!self.engineInitialized()) return;
    
    document.getElementById("fileInput").click();
}

/**
 * Respond to the menu save cashflow event.
 * @param {object} self Self object.
 */    
export function menuSaveCashflow(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    saveCashflow(self, self.activeTabIndex);
}

/**
 * Respond to the menu insert event.
 * @param {object} self Self object.
 */    
export function menuInsert(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];

    self.modalDialog.showInsertEvent(self);
    updater.focusEventGrid(tab);
}

/**
 * Respond to the menu delete event.
 * @param {object} self Self object.
 */    
export function menuDelete(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];
    if (tab.lastFocused.rowIndex < 0) return;

    if (self.engine.remove_event(self.activeTabIndex, tab.lastFocused.rowIndex)) {
        tab.eventValues.splice(tab.lastFocused.rowIndex, 1);
        tab.grdEventOptions.api.setRowData(tab.eventValues);

        updater.refreshAmResults(self);
        updater.updateTabLabel(self, self.activeTabIndex, true);

        tab.lastFocused.colDef = null;
        tab.lastFocused.column = null;
        tab.lastFocused.rowIndex = -1;
        tab.lastFocused.value = null;

        self.enableClass("btnDelete", "disabled", false);    
        self.enableClass("btnCalculate", "disabled", false);            

        updater.focusEventGrid(tab);
    }
}

/**
 * Respond to the menu cashflow calculate event.
 * @param {object} self Self object.
 */    
export function menuCalculate(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];
    if (!tab.lastFocused.colDef) return;

    let result = null;
    switch (tab.lastFocused.colDef.col_name) {
        case constant.FIELD_VALUE:
            result = self.engine.calculate_value(
                self.activeTabIndex, tab.lastFocused.rowIndex);
            let isInterest = "interest-change" in tab.eventValues[tab.lastFocused.rowIndex].extension;
            if (!result) {
                toaster.toastError(updater.getResource(self, 
                    isInterest ? constant.ERROR_CALCULATE_INTEREST : constant.ERROR_CALCULATE_PRINCIPAL));
                break;
            }
            if (isInterest) {
                result = self.engine.format_decimal_out(result);
            } else {
                result = self.engine.format_currency_out(result);
            }
            break;
        case constant.FIELD_PERIODS:
            result = self.engine.calculate_periods(
                self.activeTabIndex, tab.lastFocused.rowIndex);
                if (!result) {
                    toaster.toastError(updater.getResource(self, constant.ERROR_CALCULATE_PERIODS));
                    break;
                }
            result = self.engine.format_integer_out(result);
            break;
    }

    if (!result) return;

    tab.grdEventOptions.api.stopEditing();
    let gridRow = tab.grdEventOptions.api.getDisplayedRowAtIndex(tab.lastFocused.rowIndex);
    gridRow.setDataValue(tab.lastFocused.colDef.col_name, result);

    updater.refreshAmResults(self);
    updater.updateTabLabel(self, self.activeTabIndex, true);
    updater.focusEventGrid(tab);
}

/**
 * Respond to the menu expand cashflow event.
 * @param {object} self Self object.
 */    
export function menuExpand(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];
    
    self.setExpand(!tab.expanded);
    updater.focusEventGrid(tab);
}

/**
 * Respond to the menu cashflow summary event.
 * @param {object} self Self object.
 */    
export function menuSummary(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];

    let summary = self.engine.parse_summary(self.activeTabIndex);

    self.modalDialog.showSummary(self, summary);
    updater.focusEventGrid(tab);
}

/**
 * Respond to the next insert event.
 * @param {object} self Self object.
 */    
function nextInsert(self) {
    if (!self.engineInitialized() || self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];

    let nextName = "";
    if (tab.lastFocused.colDef) {
        nextName = tab.eventValues[tab.lastFocused.rowIndex]["Next-name"];
    }

    if (!nextName) return;
    
    self.modalDialog.createTemplateEventsShowParameters(self, nextName);
}

/**
 * Save the given cashflow.
 * @param {object} self The self object.
 * @param {number} cfIndex The cashflow index.
 */    
export function saveCashflow(self, cfIndex) {
    if (cfIndex < 0) return;

    let fileName = self.tabs[cfIndex].name;

    let text = self.engine.serialize(cfIndex,
        constant.JSON_SERIALIZE_CASHFLOW_PREFERENCES + 
        constant.JSON_SERIALIZE_CASHFLOW_SELECTED + 
        constant.JSON_SERIALIZE_EVENT_LIST);

    let blob = new Blob([text], { type: "application/json" });

    saveAs(blob, fileName + ".json");

    updater.updateTabLabel(self, cfIndex, false);
}    

/**
 * Show/hide the spinner.
 * @param {bool} isShow Show the spinner.
 */    
export function showSpinner(isShow) {

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