let twitterTimer = 0;
let isTwitterActive = false;
const timeLimit = 5 * 60 * 1000; // 5 minutes in milliseconds
let intervalId = null;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        if (tab.url && tab.url.includes("x.com")) {
            console.log("Twitter (X) detected, starting timer.");
            isTwitterActive = true;

            if (!intervalId) {
                intervalId = setInterval(() => {
                    if (isTwitterActive) {
                        twitterTimer += 1000;
                        console.log(`Timer: ${twitterTimer / 1000} seconds`);

                        if (twitterTimer >= timeLimit) {
                            console.log("Time limit reached! Redirecting...");
                            chrome.tabs.query({ url: "*://*.x.com/*" }, (tabs) => {
                                tabs.forEach((tab) => {
                                    chrome.tabs.update(tab.id, { url: chrome.runtime.getURL("blocked.html") });
                                });
                            });
                            twitterTimer = 0; // Reset timer
                            isTwitterActive = false; // Stop the timer

                            if (intervalId) {
                                clearInterval(intervalId);
                                intervalId = null;
                            }
                        }
                    }
                }, 1000);
            }
        } else {
            console.log("Leaving Twitter (X), timer reset.");
            isTwitterActive = false;
            twitterTimer = 0;

            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    }
});
