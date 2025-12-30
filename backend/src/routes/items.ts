import { Router, Request, Response } from 'express';
import { itemStore } from '../services/itemStore.js';
import { requestQueue } from '../services/requestQueue.js';
import { ITEMS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/index.js';

const router = Router();

router.get('/items', (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || ITEMS.DEFAULT_LIMIT;
  const filter = req.query.filter as string | undefined;

  const result = itemStore.getItems({ offset, limit, filter }, true);
  res.json(result);
});

router.get('/selected', (req: Request, res: Response) => {
  const offset = parseInt(req.query.offset as string) || 0;
  const limit = parseInt(req.query.limit as string) || ITEMS.DEFAULT_LIMIT;
  const filter = req.query.filter as string | undefined;

  const result = itemStore.getSelectedItems({ offset, limit, filter });
  res.json(result);
});

router.post('/items', (req: Request, res: Response) => {
  const { id } = req.body;

  if (typeof id !== 'number' || !Number.isInteger(id)) {
    res.status(400).json({ error: ERROR_MESSAGES.ID_MUST_BE_INTEGER });

    return;
  }

  const queued = requestQueue.queueAdd(id);

  if (!queued) {
    res.status(409).json({ error: ERROR_MESSAGES.ITEM_ALREADY_EXISTS });

    return;
  }

  res.status(202).json({ message: SUCCESS_MESSAGES.ITEM_QUEUED, id });
});

router.post('/select/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: ERROR_MESSAGES.INVALID_ID });

    return;
  }

  if (!itemStore.itemExists(id)) {
    res.status(404).json({ error: ERROR_MESSAGES.ITEM_NOT_FOUND });

    return;
  }

  if (itemStore.isSelected(id)) {
    res.status(409).json({ error: ERROR_MESSAGES.ITEM_ALREADY_SELECTED });

    return;
  }

  const result = await requestQueue.queueOperation('select', id);

  if (result) {
    res.json({ message: SUCCESS_MESSAGES.ITEM_SELECTED, id });
  } else {
    res.status(500).json({ error: ERROR_MESSAGES.FAILED_TO_SELECT });
  }
});

router.delete('/select/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: ERROR_MESSAGES.INVALID_ID });

    return;
  }

  if (!itemStore.isSelected(id)) {
    res.status(404).json({ error: ERROR_MESSAGES.ITEM_NOT_IN_SELECTED });

    return;
  }

  const result = await requestQueue.queueOperation('deselect', id);

  if (result) {
    res.json({ message: SUCCESS_MESSAGES.ITEM_DESELECTED, id });
  } else {
    res.status(500).json({ error: ERROR_MESSAGES.FAILED_TO_DESELECT });
  }
});

router.put('/selected/reorder', async (req: Request, res: Response) => {
  const { itemId, newIndex, filter } = req.body;

  if (typeof itemId !== 'number' || typeof newIndex !== 'number') {
    res.status(400).json({ error: ERROR_MESSAGES.ITEM_ID_AND_NEW_INDEX_REQUIRED });

    return;
  }

  if (!itemStore.isSelected(itemId)) {
    res.status(404).json({ error: ERROR_MESSAGES.ITEM_NOT_IN_SELECTED });

    return;
  }

  const result = await requestQueue.queueOperation('reorder', itemId, newIndex, filter);

  if (result) {
    res.json({ message: SUCCESS_MESSAGES.ITEM_REORDERED, itemId, newIndex });
  } else {
    res.status(500).json({ error: ERROR_MESSAGES.FAILED_TO_REORDER });
  }
});

export default router;
