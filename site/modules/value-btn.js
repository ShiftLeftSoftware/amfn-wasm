/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

/**
 * Grid value with button renderer.
 */
export class ValueBtnRenderer {
 
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