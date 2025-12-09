import { useRef, useState } from 'react';
import { Loader2, FileUp } from 'lucide-react';
import { loadPdfPages } from '../utils/pdfUtils';
import type { ImportedPage } from '../utils/pdfUtils';
import { clsx } from 'clsx';

interface PdfUploaderProps {
  onPagesAdded: (pages: ImportedPage[]) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({ onPagesAdded, className, variant = 'default' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const allPages: ImportedPage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf') {
          const pages = await loadPdfPages(file);
          allPages.push(...pages);
        }
      }
      onPagesAdded(allPages);
    } catch (error) {
      console.error('Error loading PDF(s):', error);
      alert('Failed to load PDF. Please try again.');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  if (variant === 'compact') {
    return (
      <div
        className={clsx(
          "relative border border-slate-300 rounded-xl px-4 py-2 transition-all text-center cursor-pointer flex items-center justify-center gap-2 hover:bg-slate-50",
          isLoading && "opacity-50 pointer-events-none",
          className
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        ) : (
          <FileUp className="w-5 h-5 text-slate-500" />
        )}
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
          {isLoading ? 'Processing...' : 'Add PDF'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative border-2 border-dashed rounded-xl p-8 transition-colors text-center cursor-pointer",
        isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400 hover:bg-slate-50",
        isLoading && "opacity-50 pointer-events-none",
        className
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="application/pdf"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-col items-center gap-3">
        {isLoading ? (
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        ) : (
          <FileUp className="w-10 h-10 text-slate-400" />
        )}
        <div className="text-sm text-slate-600">
          {isLoading ? (
            <p className="text-lg font-medium">Processing PDF...</p>
          ) : (
            <>
              <p className="text-lg font-medium">Click or Drag PDF here</p>
              <p className="text-xs text-slate-500 mt-1">Supports multiple files</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
