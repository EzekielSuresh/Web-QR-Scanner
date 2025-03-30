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
import { CircleAlert } from "lucide-react"
import '@mariusbongarts/previewbox/dist/link/index'
import { useState, useRef } from "react"
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

            // let qrCodeList = []
            // let tries = 0
            // const maxTries = 5

            // const { BrowserMultiFormatReader } = await import('@zxing/browser')
            // const codeReader = new BrowserMultiFormatReader()

            // while ( tries < maxTries ) {

            //     let qrCode = ""

            //     try {
            //         qrCode = await codeReader.decodeFromCanvas(canvas)
            //     } catch (error) {
            //         break
            //     }

            //     qrCodeList.push(qrCode.text)

            //     let topLeftCorner = qrCode.resultPoints[0]
            //     let topRightCorner = qrCode.resultPoints[1]
            //     let bottomRightCorner = qrCode.resultPoints[2]
            //     let width = Math.abs(topRightCorner.x - topLeftCorner.x)
            //     let height = Math.abs(topRightCorner.y - bottomRightCorner.y)
            //     await maskQRCode(ctx, img, canvas.width, canvas.height, topLeftCorner.x, topLeftCorner.y, width, height)

            //     tries++
            // }

            const results = await scanImage(imageData)
            const qrCodeList = results.map(item => {
                let text = item.text;
            
                // Remove 'chrome-extension://' if mistakenly added
                if (text.includes("chrome-extension://")) {
                    text = text.replace(/^chrome-extension:\/\/[a-zA-Z0-9_-]+\//, ""); 
                }
            
                return text;
            })
            
            // try {
            //     const results = await readBarcodes(imageData, readerOptions);
            //     setResult(results)
            // } catch (error) {
            //     setError("No QR Code found.")
            // }

            if (qrCodeList.length > 0) {
                setResult(qrCodeList)
            } else {
                setError("No QR Code found.")
            }            
                

        })
    }

    async function maskQRCode(ctx, img, width, height, x, y, maskWidth, maskHeight) {
        const padding = 10
        masks.current.push({
            x: x - padding, 
            y: y - padding, 
            maskWidth: maskWidth + 2 * padding, 
            maskHeight: maskHeight + 2 * padding
        })

        ctx.clearRect(0, 0, width, height)
    
        ctx.drawImage(img, 0, 0, width, height)
    
        ctx.fillStyle = "white";
        masks.current.forEach(mask => {
            ctx.fillRect(mask.x, mask.y, mask.maskWidth, mask.maskHeight);
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

    // async function setupZXing() {
    //     const ZXing = await import("zxing-wasm/reader");

    //     const reader = new ZXing.MultiFormatReader();
    
    //     reader.setHints(new Map([
    //         [ZXing.DecodeHintType.POSSIBLE_FORMATS, [ZXing.BarcodeFormat.QR_CODE]],
    //         [ZXing.DecodeHintType.TRY_HARDER, true]
    //     ]));
    
    //     return reader;
    // }

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
