import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import type { ImportedPage } from '../utils/pdfUtils';
import { PageCard } from './PageCard';

interface PageGridProps {
  pages: ImportedPage[];
  onReorder: (newPages: ImportedPage[]) => void;
  onDelete: (id: string) => void;
  onRotate: (id: string) => void;
}

export const PageGrid: React.FC<PageGridProps> = ({ pages, onReorder, onDelete, onRotate }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px constraint before drag starts to prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      onReorder(arrayMove(pages, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 pb-32"> {/* pb-32 for bottom bar clearance */}
          {pages.map((page, index) => (
            <PageCard
              key={page.id}
              page={page}
              index={index}
              onDelete={onDelete}
              onRotate={onRotate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
