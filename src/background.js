chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action == "capture_screen") {

        chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {

            if (chrome.runtime.lastError || !image ) {
                console.error("Failed to capture screenshot: ", chrome.runtime.lastError)
                sendResponse({ result: "Failed to capture screen."})
                return
            }

            sendResponse({result: "success", image})

        })  

        return true // Keep the listener active
    }
})