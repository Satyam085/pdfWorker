import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, RotateCw } from 'lucide-react';
import type { ImportedPage } from '../utils/pdfUtils';
import { clsx } from 'clsx';

interface PageCardProps {
  page: ImportedPage;
  index: number;
  onDelete: (id: string) => void;
  onRotate: (id: string) => void;
}

export const PageCard: React.FC<PageCardProps> = ({ page, index, onDelete, onRotate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden select-none touch-none",
        isDragging ? "opacity-50 z-50 ring-2 ring-blue-500 scale-105" : "hover:shadow-md"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="aspect-[1/1.4] relative bg-gray-100 flex items-center justify-center overflow-hidden">
        <img
          src={page.previewUrl}
          alt={`Page ${index + 1}`}
          className="w-full h-full object-contain"
          style={{ transform: `rotate(${page.rotation}deg)` }}
        />
        
        {/* Page Number Badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
          {index + 1}
        </div>
      </div>

      {/* Hover Controls */}
      <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity border-t border-gray-100">
        <button
          onClick={(e) => { e.stopPropagation(); onRotate(page.id); }}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-blue-600 transition-colors"
          title="Rotate 90°"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(page.id); }}
          className="p-1.5 hover:bg-red-50 rounded-full text-gray-600 hover:text-red-500 transition-colors"
          title="Delete Page"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
