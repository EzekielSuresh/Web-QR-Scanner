# Web QR Scanner

A simple chrome extension that allows users to scan visble QR Codes directly from web pages.

### Features:
* Optimized for performance with Vite.
* Preview links from scanned QR Codes.
* Simple and minimal UI with shadcn/ui.

### Built With
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) 
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
* ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
* [**Previewbox**](https://github.com/MariusBongarts/previewbox) by @mariusbongarts

## Getting Started

### Prerequisites

Make sure you have the following installed:

* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/EzekielSuresh/Web-QR-Scanner
   cd Web-QR-Scanner
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Build the project:
   ```sh
   npm run build
   ```

4. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer Mode** 
   - Click **Load unpacked**
   - Select the `dist/` folder 

## Usage

### Permissions Used

- `tabs`: Required to capture the visible tab.

## Roadmap

- [ ] Improve UI for preview box
- [ ] Add support for multiple QR Code scanning
- [ ] Add copy button for scanned QR Code URL




