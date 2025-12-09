import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker. 
// Note: In a real Vite app, you often want to import the worker script as a URL.
// We will try to use the standard import with ?url suffix if possible, or fall back to standard CDN if local fails (but goal is offline).
// For this environment, we'll try the explicit import.
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export interface ImportedPage {
  id: string;
  fileId: string;
  pageIndex: number;
  previewUrl: string;
  fileData: ArrayBuffer; // Keeping reference to source file data
  rotation: number;
  globalIndex?: number;
}

export const loadPdfPages = async (file: File): Promise<ImportedPage[]> => {
  const fileData = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: fileData.slice(0) }).promise;
  const pageCount = pdf.numPages;
  const fileId = crypto.randomUUID();
  
  const pages: ImportedPage[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 }); // Thumbnail scale
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) throw new Error('Canvas context not available');

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas, // Required by type definition in newer pdfjs-dist
    }).promise;

    const previewUrl = canvas.toDataURL();
    
    pages.push({
      id: crypto.randomUUID(),
      fileId,
      pageIndex: i - 1, // 0-based index for pdf-lib
      previewUrl,
      fileData,
      rotation: 0
    });
  }

  return pages;
};

export const generatePdf = async (pages: ImportedPage[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  // Group pages by fileId to minimize loading specific PDFs multiple times
  // In this simple implementation, we might reload the doc for each page group
  // Optimization: cache loaded PDFs
  const pdfCache = new Map<string, PDFDocument>();

  for (const page of pages) {
    let sourcePdf = pdfCache.get(page.fileId);
    if (!sourcePdf) {
      sourcePdf = await PDFDocument.load(page.fileData);
      pdfCache.set(page.fileId, sourcePdf);
    }

    const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [page.pageIndex]);
    
    // Apply rotation if needed
    if (page.rotation !== 0) {
      const existingRotation = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees(existingRotation + page.rotation));
    }
    
    mergedPdf.addPage(copiedPage);
  }

  return mergedPdf.save();
};
