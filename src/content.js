import jsQR from "jsqr"

chrome.storage.local.get(["qrScreenshot"]).then((data) => {

    if (!data.qrScreenshot) {
        return
    }

    const img = new Image()
    img.src = data.qrScreenshot

    img.onload = () => {

        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d", { alpha: false })

        canvas.width = img,width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const qrCode = jsQR(imageData.data, imageData.width, imageData.height)
 
        const result = qrCode ? qrCode.data : "No QR Code found."
        
        chrome.runtime.sendMessage({action: "qr_result", result})
    }
})