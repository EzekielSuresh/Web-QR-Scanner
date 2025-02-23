import React from "react"
import { Button } from "@/components/ui/button"
import { ScanQrCode } from "lucide-react"

function Popup() {

    return (
        <div className="w-[300px] p-4 flex flex-col items-center gap-4">
            <h1 className="text-center">Web QR Scanner</h1>
            <Button className="w-full"> 
                <ScanQrCode className="w-5 h-5 mr-2"/> Scan QR Code
            </Button>
        </div>
    )
}

export default Popup
