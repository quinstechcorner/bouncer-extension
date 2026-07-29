document.addEventListener("DOMContentLoaded", () => {
    const enableToggle = document.getElementById("enableToggle");

    // Load initial state
    chrome.storage.local.get(["isEnabled"], (data) => {
        enableToggle.checked = data.isEnabled !== false;
    });

    // Handle toggle switch changes
    enableToggle.addEventListener("change", () => {
        chrome.storage.local.set({ isEnabled: enableToggle.checked });
    });
});//
//  options.js
//  bouncer
//
//  Created by Quin on 29/7/2026.
