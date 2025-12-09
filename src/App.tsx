import { useState } from 'react';
import { FileDown, Trash2, Heart, Github } from 'lucide-react';
import { PdfUploader } from './components/PdfUploader';
import { PageGrid } from './components/PageGrid';
import { generatePdf } from './utils/pdfUtils';
import type { ImportedPage } from './utils/pdfUtils';

function App() {
  const [pages, setPages] = useState<ImportedPage[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const handlePagesAdded = (newPages: ImportedPage[]) => {
    const startIndex = pages.length;
    const pagesWithIndex = newPages.map((p, i) => ({
      ...p,
      globalIndex: startIndex + i + 1
    }));
    setPages((prev) => [...prev, ...pagesWithIndex]);
  };

  const handleReorder = (newPages: ImportedPage[]) => {
    setPages(newPages);
  };

  const handleDelete = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRotate = (id: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  const handleExport = async () => {
    if (pages.length === 0) return;
    setIsExporting(true);
    try {
      const pdfBytes = await generatePdf(pages);
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged-document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              PDF Worker
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">Offline</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">
              {pages.length} page{pages.length !== 1 && 's'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md">
              <PdfUploader onPagesAdded={handlePagesAdded} />
            </div>
            <p className="mt-8 text-slate-500 text-sm max-w-lg text-center leading-relaxed">
              Your files are processed entirely in your browser. No data leaves your device.
              <br />
              Merge, split, reorder, and rotate pages instantly.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Toolbar for small screens or quick actions could go here */}
             <div className="mb-6 flex justify-between items-center">
               <h2 className="text-lg font-medium text-slate-700">Organize Pages</h2>
               <button 
                 onClick={() => setPages([])}
                 className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors"
              >
                 <Trash2 className="w-4 h-4" />
                 Clear All
               </button>
             </div>

             <PageGrid 
               pages={pages} 
               onReorder={handleReorder} 
               onDelete={handleDelete}
               onRotate={handleRotate}
             />
          </div>
        )}
      </main>

      <footer className="p-6 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2">
          <span>Made with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span>by Satyam Singh</span>
          <a 
            href="https://github.com/Satyam085" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-slate-800 transition-colors ml-2"
            title="Visit GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </footer>

      {/* Floating Action Bar */}
      {pages.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200/50 shadow-2xl rounded-2xl p-2 flex items-center gap-2">
            <div className="flex-1 flex items-center justify-center border-r border-slate-200 pr-2">
               <span className="text-sm font-medium text-slate-700">{pages.length} Pages</span>
            </div>
            
             <PdfUploader 
               onPagesAdded={handlePagesAdded} 
               variant="compact"
               className="flex-1 w-auto h-12 border-0 bg-transparent hover:bg-slate-50" 
             />

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
            >
              {isExporting ? (
                 <span>Saving...</span>
              ) : (
                <>
                  <FileDown className="w-5 h-5" />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
