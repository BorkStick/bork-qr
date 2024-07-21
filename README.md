# Bork QR Code Generator

This project is a QR code generator built with Vite, React, and TypeScript. It allows users to generate QR codes with customizable URLs and embedded logos. Users can choose from predefined logos or upload their own logo to be displayed at the center of the QR code.

## Features

- Generate QR codes with customizable URLs
- Embed predefined or custom logos in the center of the QR code
- Download the generated QR code as an image file
- Responsive and modern UI design

## Preview

![QR Code Generator Preview](./public/screenshot%20v2.png)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) (version 6.x or later)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/borkstick/bork-qr.git
    cd bork-qr
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Project

1. To start the development server:

    ```bash
    npm run dev
    ```
2. Open your browser and navigate to http://localhost:3000 to see the application in action.

### Building for Production
To create a production build:

```bash
npm run build
```
The output will be in the dist directory. You can serve it with any static file server.

### Usage
1. Select a TLD (Top-Level Domain) from the dropdown or choose "Custom" to enter a custom TLD.
1. Enter the URL slug in the input field.
1. Choose a logo from the predefined options or upload your own logo.
1. The QR code will be generated and displayed automatically.
1. Click the "Download QR Code" button to download the generated QR code as a PNG file.
