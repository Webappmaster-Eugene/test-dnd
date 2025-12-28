import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useItemsStore } from '@/store/useItemsStore';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UI_TEXT } from '@/constants';

export function LeftPanel() {
  const {
    leftItems,
    leftFilter,
    leftHasMore,
    leftLoading,
    leftTotal,
    setLeftFilter,
    fetchLeftItems,
    selectItem,
    addItem,
  } = useItemsStore();

  const [newItemId, setNewItemId] = useState('');

  const { containerRef, sentinelRef } = useInfiniteScroll({
    onLoadMore: fetchLeftItems,
    hasMore: leftHasMore,
    loading: leftLoading,
  });

  useEffect(() => {
    fetchLeftItems(true);
  }, []);

  const handleAddItem = async () => {
    const id = parseInt(newItemId);
    if (isNaN(id)) {
      toast.error(UI_TEXT.ADD_STATUS.INVALID_ID);
      return;
    }

    const idToAdd = id;
    setNewItemId('');

    const success = await addItem(idToAdd);

    if (success) {
      toast.success(UI_TEXT.ADD_STATUS.ADDED_TO_QUEUE);
    } else {
      toast.error(UI_TEXT.ADD_STATUS.ALREADY_EXISTS);
    }
  };

  const handleSelectItem = (id: number) => {
    selectItem(id);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg">{UI_TEXT.LEFT_PANEL_TITLE}</CardTitle>
        <div className="text-sm text-gray-500">
          {UI_TEXT.SHOWN_COUNT} {leftItems.length} / {leftTotal}
        </div>
        <Input
          placeholder={UI_TEXT.FILTER_PLACEHOLDER}
          value={leftFilter}
          onChange={(e) => setLeftFilter(e.target.value)}
          className="mt-2"
        />
        <div className="flex gap-2 mt-2">
          <Input
            placeholder={UI_TEXT.NEW_ID_PLACEHOLDER}
            value={newItemId}
            onChange={(e) => setNewItemId(e.target.value)}
            type="number"
          />
          <Button onClick={handleAddItem} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0" style={{ minHeight: 0 }}>
        <div
          ref={containerRef}
          className="h-full overflow-y-auto px-6 pb-6"
        >
          <div className="space-y-1">
            {leftItems.map((id) => (
              <div
                key={id}
                className="flex items-center justify-between p-2 rounded hover:bg-gray-100 cursor-pointer border border-transparent hover:border-gray-200"
                onClick={() => handleSelectItem(id)}
              >
                <span className="font-mono text-sm">{id}</span>
                <span className="text-xs text-gray-400">{UI_TEXT.CLICK_TO_SELECT}</span>
              </div>
            ))}
            {leftLoading && (
              <div className="text-center py-4 text-gray-500">
                {UI_TEXT.LOADING}
              </div>
            )}
            <div ref={sentinelRef} className="h-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
