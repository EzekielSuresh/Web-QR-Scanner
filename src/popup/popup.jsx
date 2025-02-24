import React from "react"
import { Button } from "@/components/ui/button"
import { ScanQrCode } from "lucide-react"
import '../index.css'

function Popup() {

    return (
        <div className="w-[300px] p-4 flex flex-col items-center gap-4">
            <h1 className="text-center font-semibold">Web QR Scanner</h1>
            <Button className="w-full font-semibold"> 
                <ScanQrCode className="w-5 h-5 mr-2"/> 
                <span className="w-[120px] text-lg">Scan QR Code</span>
            </Button>
        </div>
    )
}

export default Popup
