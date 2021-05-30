/*
    Amfn Web Assembly.
    Copyright (c) 2021 ShiftLeft Software

    Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
    http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
    <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
    option. This file may not be copied, modified, or distributed
    except according to those terms.
*/

import * as global from "./global";

/**
 * Show a toast message.
 * @param {string} title The title to show in the toast.
 * @param {string} text The text to show in the toast.
 * @param {string} backgroundColor The toast's background color.
 */    
function toast(title, text, backgroundColor) {
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
export function toastInfo(text) {
    toast(global.config.helpTitleInfo, text, "linear-gradient(to right, Blue, DarkBlue)");
}

/**
 * Show an error toast message.
 * @param {string} text The text to show in the toast.
 */    
export function toastError(text) {
    toast(global.config.helpTitleError, text, "linear-gradient(to right, Red, DarkRed)");
}