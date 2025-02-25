chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action == "capture_screen") {

        chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {

            if (chrome.runtime.lastError || !image ) {
                sendResponse({ result: "Failed to capture screen."})
            }
            
            chrome.storage.local.set({ qrScreenshot: image }).then(() => {

                chrome.scripting.executeScript({
                    target: { tabId: sender.tab.id },
                    files: ["content.js"]
                })
            })

            sendResponse({ result: "Processing QR Code..."})
        })

        return true
    }
})