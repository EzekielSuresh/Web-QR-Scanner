import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink } from "lucide-react"
import '../../index.css'


export function LinkBox({ url }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(url)
  }

  const handleOpen = () => {
    window.open(url, "_blank")
  }

  return (
    <div className="flex items-center gap-1 mb-5">
        <Input
            value={url}
            className="flex-1 cursor-text text-sm w-[300px]"
        />
        <Button variant="outline" size="icon" onClick={handleCopy}>
            <Copy className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleOpen}>
            <ExternalLink className="w-4 h-4" />
        </Button>      
    </div>
  )
}
