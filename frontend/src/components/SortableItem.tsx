import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SortableItemProps } from '@/types';

export function SortableItem({ id, onDeselect }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const transformStyle = CSS.Transform.toString(transform);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex items-center justify-between p-2 rounded bg-white border border-gray-200 hover:border-gray-300',
        isDragging && 'opacity-50'
      )}
      style={{
        transform: transformStyle,
        transition,
      }}
    >
      <div className="flex items-center gap-2">
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        <span className="font-mono text-sm">{id}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          onDeselect();
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
