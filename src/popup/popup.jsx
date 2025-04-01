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
    AlertTitle
 } from "@/components/ui/alert";
import { ScanQrCode } from "lucide-react"
import { CircleAlert } from "lucide-react"
import '@mariusbongarts/previewbox/dist/link/index'
import { useState } from "react"
import '../index.css'

function Popup() {

    const [result, setResult] = useState([])
    const [error, setError] = useState(null)
    const [capturedImage, setCapturedImage] = useState(null)

    const handleClick = async () => {
        setError(null)
        setCapturedImage(null)
        setResult([])

        chrome.runtime.sendMessage({ action: "capture_screen"}, async (response) => {
            if (!response || response.result != "success") {
                setError("Failed to capture screen.")
                return
            }

            setCapturedImage(response.image)

            const img = new Image()
            img.src = response.image
            await img.decode()

            let canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d", { alpha: false, willReadFrequently: true })

            canvas.width = img.width
            canvas.height = img.height
            ctx.imageSmoothingEnabled = false

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            const results = await scanImage(imageData)
            const qrCodeList = results.map(item => {
                let url = item.text.trim();
    
                // Check if it already has a protocol
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                    url = "http://" + url;
                }
            
                return url;
            })

            if (qrCodeList.length > 0) {
                setResult(qrCodeList)
            } else {
                setError("No QR Code found.")
            }            
                

        })
    }

    async function scanImage(imageData) {
        try {
          const { readBarcodes } = await import("zxing-wasm/reader");

          const wasmURL = chrome.runtime.getURL("public/wasm/zxing_reader.wasm");
      
          const readerOptions = {
            tryHarder: true,
            formats: ["QRCode"],
            maxNumberOfSymbols: 10,
            wasmURL: wasmURL
          };
      
          const results = await readBarcodes(imageData, readerOptions);
          return results
        } catch (error) {
          return []
        }
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
                    {capturedImage && (
                        <div className="mb-4">
                            <img src={capturedImage} alt="Captured Screen" className="w-full rounded-lg shadow-md"/>
                        </div>
                    )}
                    {!result || result.length == 0 ? (
                        <div></div>
                    ) : (
                        <div className="w-full">
                            {result.map((item, index) => (
                                <previewbox-link 
                                    key={index}
                                    href={item}
                                    style={{ 
                                        display: "block", 
                                        width: "300px", 
                                        maxWidth: "100%" 
                                    }}
                                    light
                                ></previewbox-link>
                            ))}  
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
