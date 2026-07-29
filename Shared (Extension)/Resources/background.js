// Redirect page
const BOUNCER_URL = "https://quinstechcorner.github.io/bouncer/";

// Initial sync when Safari starts or extension updates
chrome.runtime.onInstalled.addListener(() => syncFromStorage());
chrome.runtime.onStartup.addListener(() => syncFromStorage());

// React instantly when popup or options page modifies local storage
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local") {
        syncFromStorage();
    }
});

function syncFromStorage() {
    chrome.storage.local.get(["blockedDomains", "isEnabled"], (data) => {
        const domains = data.blockedDomains || [];
        const isEnabled = data.isEnabled !== false;
        syncRules(domains, isEnabled);
    });
}

async function syncRules(rawDomains, isEnabled) {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    if (!isEnabled || !rawDomains || rawDomains.length === 0) {
        if (existingRuleIds.length > 0) {
            await chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: existingRuleIds,
                addRules: []
            });
        }
        return;
    }

    const newRules = rawDomains.map((domain, index) => {
        const cleanDomain = domain.trim().toLowerCase()
            .replace(/^(https?:\/\/)?(www\.)?/, "")
            .split('/')[0];

        return {
            id: index + 1,
            priority: 1,
            action: {
                type: "redirect",
                redirect: { url: BOUNCER_URL }
            },
            condition: {
                urlFilter: cleanDomain,
                resourceTypes: ["main_frame"]
            }
        };
    }).filter(rule => rule.condition.urlFilter.length > 2);

    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds,
        addRules: newRules
    });
}
