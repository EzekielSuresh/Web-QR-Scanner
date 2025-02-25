import { Button } from "@/components/ui/button"
import { ScanQrCode } from "lucide-react"
import { useState } from "react"
import '../index.css'

function Popup() {

    const [result, setResult] = useState("")

    const handleClick = () => {
        chrome.runtime.sendMessage({ action: "capture_screen"}, (response) => {

            chrome.runtime.onMessage.addListener((message) => {

                if ( message.action == "qr_result" ) {
                    setResult(response.result)
                } else {
                    setResult("No QR Code detected.")
                }
            })
        })
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
