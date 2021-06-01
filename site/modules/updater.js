/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

import * as constant from "./constant.js";

/**
 * Create template events and refresh display.
 * @param {object} self Self object.
 * @param {string} event Event name.
 */    
export function createTemplateEvents(self, event) {            
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

    let rowIndex = refreshEvents(self, eventDate, sortOrder);
    refreshAmResults(self);
    updateTabLabel(self, self.activeTabIndex, true);

    return paramCount;
}

/**
 * Focus the event grid and the last focused cell.
 * @param {object} tab Tab object.
 */    
export function focusEventGrid(tab) {   
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
export function getEom(self, rowIndex, tableType) {
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
export function getResource(self, name) {
    return self.engine.get_resource(self.activeTabIndex, name); // -1 will return a user locale resource string
}

/**
 * Refresh events.
 * @param {object} self Self object.
 * @param {string} eventDate Date or null.
 * @param {number} sortOrder Sort order.
 * @return {number} The event row index.
 */
export function refreshEvents(self, eventDate, sortOrder) {
    if (self.activeTabIndex < 0) return 0;

    let tab = self.tabs[self.activeTabIndex];

    tab.grdEventOptions.api.stopEditing();
    tab.grdEventOptions.api.clearFocusedCell();

    tab.eventValues = JSON.parse(self.engine.table_values(self.activeTabIndex, constant.TABLE_EVENT));        

    tab.grdEventOptions.api.setRowData(tab.eventValues);  

    let rowIndex = tab.lastFocused.rowIndex > 0 ? tab.lastFocused.rowIndex : 0;
    if (eventDate.length > 0) {
        rowIndex = self.engine.get_event_by_date(self.activeTabIndex, eventDate, sortOrder);
    }

    let column = null;
    if (tab.lastFocused.colDef) {
        column = tab.lastFocused.column;
    } else {
        column = tab.grdEventOptions.columnApi.getColumn(constant.FIELD_DATE);
    }
    if (!column) return rowIndex;

    tab.grdEventOptions.api.setFocusedCell(rowIndex, column);
    
    return rowIndex;
}

/**
 * Refresh amortization results.
 * @param {object} self Self object.
 */
export function refreshAmResults(self) {
    if (self.activeTabIndex < 0) return;

    let tab = self.tabs[self.activeTabIndex];

    tab.amValues = JSON.parse(self.engine.table_values(self.activeTabIndex, constant.TABLE_AM));        

    if (tab.expanded) {
        tab.grdAmOptions.api.setRowData(tab.amValues.expanded);  
    } else {
        tab.grdAmOptions.api.setRowData(tab.amValues.compressed);  
    }      

    refreshStatusLine(self);  
}

/**
 * Clear status line.
 */
export function clearStatusLine() {

    let divStatus = document.getElementById("divStatus");

    divStatus.innerText = "";  
}

/**
 * Refresh status line.
 * @param {object} self Self object.
 */
export function refreshStatusLine(self) {
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
export function updateTabLabel(self, cfIndex, savePending) {
    if (cfIndex < 0) return;

    let tab = self.tabs[cfIndex];
    tab.savePending = savePending;

    let spanLabel = tab.divTab.querySelector(".tabLabel");
    spanLabel.innerHTML = tab.label + (savePending ? "*" : "") + " ";
}