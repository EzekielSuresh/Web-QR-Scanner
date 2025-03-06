async function fetchQRImage() { 
    try{
        const data = await new Promise((resolve, reject) => {
            chrome.storage.local.get(["qrScreenshot"], (data) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError)
                } else {
                    resolve(data)
                }   
            }) 
        
        })

        if (!data.qrScreenshot) {
            console.log("No QR screenshot found.")
            return
        }

        processQRCode(data.qrScreenshot)

    } catch (error) {
        console.error("Error fetching data: ", error)
    }  
}


function processQRCode(imageSrc) {
    const img = new Image()
    img.src = imageSrc

    img.onload = async () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d", { alpha: false })

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        await chrome.storage.local.set({ 
            qrImageData: Array.from(imageData.data),
            qrImageWidth: imageData.width,
            qrImageHeight: imageData.height
        })

        chrome.runtime.sendMessage({action: "decode_qr"})

    }
}

fetchQRImage()