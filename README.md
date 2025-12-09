# Offline PDF Worker

A powerful, secure, and fully offline PDF manipulation tool built with React. Merge, split, rearrange, rotate, and delete PDF pages directly in your browser without ever uploading your files to a server.

## 🚀 Features

-   **100% Offline**: All processing happens locally in your browser. No data leaves your device.
-   **Page Management**:
    -   **Reorder**: Drag and drop pages to rearrange them.
    -   **Rotate**: Rotate individual pages 90 degrees clockwise.
    -   **Delete**: Remove unwanted pages.
-   **Merge Capabilities**: Combine pages from multiple PDF files into a single document.
-   **Visual Interface**: High-quality page thumbnails for easy organization.

## 🛠️ Tech Stack

-   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **PDF Processing**:
    -   [`pdf-lib`](https://pdf-lib.js.org/): For modifying, merging, and saving PDFs.
    -   [`pdfjs-dist`](https://mozilla.github.io/pdf.js/): For rendering PDF page previews.
-   **Interactions**: [`@dnd-kit`](https://dndkit.com/): For performant drag-and-drop functionality.
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   pnpm (recommended) or npm/yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/satyam085/pdf-worker.git
    cd pdf-worker
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the App

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

Build the application for deployment:

```bash
pnpm build
```

The output files will be in the `dist` directory.

## 🛡️ Privacy

This application is designed with privacy as a priority. Unlike many online PDF tools, **Offline PDF Worker** processes everything on the client side. Your sensitive documents are never sent to a cloud server, making it safe for confidential data.
