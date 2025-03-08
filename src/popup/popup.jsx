import { Button } from "@/components/ui/button"
import { ScanQrCode } from "lucide-react"
import { useState } from "react"
import { useEffect } from "react"
import jsQR from "jsqr"
import '../index.css'

function Popup() {

    const [result, setResult] = useState("")
    const [error, setError] = useState(null)

    const handleClick = () => {
        chrome.runtime.sendMessage({ action: "capture_screen"}, (response) => {
            if (!response || response.result != "success") {
                setError("Failed to capture screen.")
                return
            }

            const img = new Image()
            img.src = response.image
            
            img.onload = () => {
                const canvas = document.createElement("canvas")
                const ctx = canvas.getContext("2d", { alpha: false })

                canvas.width = img.width
                canvas.height = img.height
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

                const qrCode = jsQR(imageData.data, imageData.width, imageData.height)

                if (qrCode) {
                    setResult(qrCode.data)
                } else {
                    setResult("No QR Code found.")
                }

            }
        })
    }

    return (
        <div className="w-[300px] p-4 flex flex-col items-center gap-4">
            <h1 className="text-center font-semibold">Web QR Scanner</h1>
            <Button onClick={handleClick} className="w-full font-semibold"> 
                <ScanQrCode className="w-5 h-5"/> 
                <span className="text-md">Scan QR Code</span>
            </Button>
            <p>URL: {result}-{error}</p>
        </div>
    )
}

export default Popup
