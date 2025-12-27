import { useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useItemsStore } from '@/store/useItemsStore';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SortableItem } from './SortableItem';
import { UI_TEXT } from '@/constants';

export function RightPanel() {
  const {
    rightItems,
    rightFilter,
    rightHasMore,
    rightLoading,
    rightTotal,
    setRightFilter,
    fetchRightItems,
    deselectItem,
    reorderItem,
  } = useItemsStore();

  const { containerRef, sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchRightItems,
    hasMore: rightHasMore,
    loading: rightLoading,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchRightItems(true);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = rightItems.indexOf(Number(active.id));
      const newIndex = rightItems.indexOf(Number(over.id));

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(rightItems, oldIndex, newIndex);
        useItemsStore.setState({ rightItems: newItems });
        reorderItem(Number(active.id), newIndex);
      }
    }
  };

  const handleDeselectItem = (id: number) => {
    deselectItem(id);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg">{UI_TEXT.RIGHT_PANEL_TITLE}</CardTitle>
        <div className="text-sm text-gray-500">
          {UI_TEXT.SHOWN_COUNT} {rightItems.length} / {rightTotal}
        </div>
        <Input
          placeholder={UI_TEXT.FILTER_PLACEHOLDER}
          value={rightFilter}
          onChange={(e) => setRightFilter(e.target.value)}
          className="mt-2"
        />
        <div className="text-xs text-gray-400 mt-1">
          {UI_TEXT.DRAG_TO_SORT}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0" style={{ minHeight: 0 }}>
        <div
          ref={containerRef}
          className="h-full overflow-y-auto px-6 pb-6"
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={rightItems}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-1">
                {rightItems.map((id) => (
                  <SortableItem
                    key={id}
                    id={id}
                    onDeselect={() => handleDeselectItem(id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          {rightLoading && (
            <div className="text-center py-4 text-gray-500">
              {UI_TEXT.LOADING}
            </div>
          )}
          <div ref={sentinelRef} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );
}
