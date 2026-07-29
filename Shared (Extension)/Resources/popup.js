document.addEventListener("DOMContentLoaded", () => {
    const blockCurrentBtn = document.getElementById("blockCurrentBtn");
    const domainList = document.getElementById("domainList");
    const saveBtn = document.getElementById("saveBtn");
    const statusMsg = document.getElementById("statusMsg");

    // Load existing blocked domains
    chrome.storage.local.get(["blockedDomains"], (data) => {
        if (data.blockedDomains && Array.isArray(data.blockedDomains)) {
            domainList.value = data.blockedDomains.join("\n");
        }
    });

    // One-click block for active tab
    blockCurrentBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0] || !tabs[0].url) return;

            try {
                const url = new URL(tabs[0].url);
                const domain = url.hostname.replace(/^(www\.)?/, "").toLowerCase();

                if (domain && domain !== "newtab" && domain !== "") {
                    const currentDomains = domainList.value
                        .split("\n")
                        .map(d => d.trim().toLowerCase())
                        .filter(d => d.length > 0);

                    if (!currentDomains.includes(domain)) {
                        currentDomains.push(domain);
                        domainList.value = currentDomains.join("\n");
                        saveAndSync(currentDomains);
                    }
                }
            } catch (e) {
                console.error("Bouncer: Unable to parse URL", e);
            }
        });
    });

    // Save button click
    saveBtn.addEventListener("click", () => {
        const domains = domainList.value
            .split("\n")
            .map(d => d.trim().toLowerCase())
            .filter(d => d.length > 0);

        saveAndSync(domains);
    });

    function saveAndSync(domains) {
        chrome.storage.local.set({ blockedDomains: domains }, () => {
            statusMsg.style.display = "block";
            setTimeout(() => { statusMsg.style.display = "none"; }, 1500);
        });
    }
});
