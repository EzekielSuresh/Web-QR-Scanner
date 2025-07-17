import { Button } from "./button"

export function BatchAction({ urls }) {

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(urls.join(',\n'))
        } catch (err) {
            console.log("Failed to copy URLs")
        }
    }

    const handleOpen = () => {
        urls.forEach(url => {
            chrome.tabs.create({ url, active: false})
        });
    }

    return (
        <div className="flex justify-between gap-2">
            <Button 
                variant="secondary" 
                className="flex-1 border hover:bg-gray-200"
                onClick={handleCopy}
            >
                Copy URLs
            </Button>
            <Button 
                variant="secondary" 
                className="flex-1 border hover:bg-gray-200"
                onClick={handleOpen}
            >
                Open URLs
            </Button>
        </div>
    )
}

