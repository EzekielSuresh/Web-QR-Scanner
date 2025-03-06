chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action == "capture_screen") {

        chrome.tabs.captureVisibleTab(null, { format: "png" }, async (image) => {

            if (chrome.runtime.lastError || !image ) {
                console.error("Failed to capture screenshot: ", chrome.runtime.lastError)
                sendResponse({ result: "Failed to capture screen."})
                return
            }
            
            try{

                // Store screenshot in local storage
                await chrome.storage.local.set({ qrScreenshot: image })

                // Find active tab and execute content script
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (!tabs || tabs.length === 0) {
                        console.error("No active tabs found.");
                        sendResponse({ result: "No active tabs found." })
                        return
                    }

                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ["content.js"]
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Failed to execute content script:", chrome.runtime.lastError)
                            sendResponse({ result: "Failed to process QR Code." });
                            return
                        }
                    })
                })

            } catch (error) {
                console.error("Error storing screenshot: ", error)
                sendResponse({ result: "Failed to store screenshot."})
            }

        })  

        return true // Keep the llistener active
    }
})