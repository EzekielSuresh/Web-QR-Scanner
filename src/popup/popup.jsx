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
            if (chrome.runtime.lastError || !response ) {
                setError("Failed to capture screen.")
                return
            }
        })
    } 

    useEffect(() => {
        const handleMessage = async (message) => {
            if (message.action == "decode_qr"){
                try {
                    const { qrImageData, qrImageWidth, qrImageHeight } = await new Promise((resolve, reject) => {
                        chrome.storage.local.get(["qrImageData", "qrImageWidth", "qrImageHeight"], (result) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError)
                            } else {
                                resolve(result)
                            }
                        })
                    })
                    
                    if (!qrImageData || !qrImageWidth || ! qrImageHeight) {
                        setError("No QR image data found.")
                        return
                    }    
                    
                    const imageData = new ImageData(
                        new Uint8ClampedArray(qrImageData),
                        qrImageWidth,
                        qrImageHeight
                    )
                        
                    const qrURL = jsQR(imageData.data, imageData.width, imageData.height)
                    if (qrURL) {
                        setResult(qrURL)
                    } else {
                        setError("No QR Code detected.")
                    }                                           
                } catch (error) {
                    setError("Error processing QR Code.")
                    console.error(error)
                }
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage)
        return () => chrome.runtime.onMessage.removeListener(handleMessage)
    }, [])

    const decodeQRCode = (imageData) => {
        const url = jsQR(imageData.data, imageData.width, imageData.height)
        return url ? url.data : null
    }    

    return (
        <div className="w-[300px] p-4 flex flex-col items-center gap-4">
            <h1 className="text-center font-semibold">Web QR Scanner</h1>
            <Button onClick={handleClick} className="w-full font-semibold"> 
                <ScanQrCode className="w-5 h-5"/> 
                <span className="text-md">Scan QR Code</span>
            </Button>
            <p>URL: {result}</p>
        </div>
    )
}

export default Popup
