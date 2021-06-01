/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/
     
import * as eventHelper from "./modules/event-helper.js";
import * as toaster from "./modules/toaster.js";
import { CashflowManager } from "./modules/cashflow-manager.js";

// AmFn Wasm - Rust
const amfnWasmRust = "./node_modules/amfnwasm/amfnwasm_bg.wasm";

/**
 * Wait for the DOM content to be loaded and initialize the app.
 */    
 document.addEventListener("DOMContentLoaded", () => {

    /**
     * Load the AmFn Wasm and initialize the cashflow manager.
     */    
    async function runAmFnWasm() {
        await wasm_bindgen(amfnWasmRust);
        
        eventHelper.showSpinner(false);

        let cashflowManager = new CashflowManager();
    
        document.getElementById("menuNew").addEventListener("click", () => eventHelper.menuNewCashflow(cashflowManager));    
        document.getElementById("menuOpen").addEventListener("click", () => eventHelper.menuOpenCashflow(cashflowManager));    
        document.getElementById("menuClose").addEventListener("click", () => eventHelper.menuCloseCashflow(cashflowManager));    
        document.getElementById("menuSave").addEventListener("click", () => eventHelper.menuSaveCashflow(cashflowManager));    
    
        document.getElementById("btnInsert").addEventListener("click", () => eventHelper.menuInsert(cashflowManager));
        document.getElementById("btnDelete").addEventListener("click", () => eventHelper.menuDelete(cashflowManager));
        document.getElementById("btnCalculate").addEventListener("click", () => eventHelper.menuCalculate(cashflowManager));
    
        document.getElementById("btnExpand").addEventListener("click", () => eventHelper.menuExpand(cashflowManager));
        document.getElementById("btnSummary").addEventListener("click", () => eventHelper.menuSummary(cashflowManager));
    
        document.getElementById("menuUserPreferences").addEventListener("click", () => eventHelper.menuUserPreferences(cashflowManager)); 
        
        document.getElementById("fileInput").addEventListener("change", (e) => { 
            if (e.target.files.length < 1) {
                toaster.toastError(Updater.getResource(cashflowManager, MSG_SELECT_FILE));
                return;
            }
    
            let name = e.target.value.replace(/\\/g, "/").split('/').pop();
    
            eventHelper.fileInput(cashflowManager, name, e.target.files[0]); 
            e.target.value = ""; 
        });
    }

    eventHelper.showSpinner(true);
    runAmFnWasm();

});