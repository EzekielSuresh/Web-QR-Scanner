import { Button } from "@/components/ui/button"
import { 
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter 
} from "@/components/ui/card"
import { 
    Alert,
    AlertDescription,
    AlertTitle
 } from "@/components/ui/alert";
import { ScanQrCode } from "lucide-react"
import { CircleAlert } from "lucide-react";
import '@mariusbongarts/previewbox/dist/link/index';
import { useState } from "react"
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
                    setError("No QR Code found.")
                }

            }
        })
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-md">
                <CardHeader>
                    <CardTitle className="text-lg">Web QR Scanner</CardTitle>
                    <CardDescription>Make sure QR code is visible on active tab!</CardDescription>
                </CardHeader>
                <CardContent> 
                    {error && 
                    <Alert variant="destructive">
                        <CircleAlert className="h-4 w-4"/>
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>}

                    {!result ? (
                        <div></div>
                    ) : (
                        <div className="w-full">
                            <previewbox-link 
                                href={result}
                                style={{ 
                                    display: "block", 
                                    width: "300px", 
                                    maxWidth: "100%" 
                                }}
                                light
                            ></previewbox-link>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="flex justify-end w-full">
                        <Button onClick={handleClick} className="w-[75px]">
                            <ScanQrCode className="w-5 h-5"/> 
                        </Button>
                    </div>                    
                </CardFooter>
            </Card>
        </div>
    )
}

export default Popup
