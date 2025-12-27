export const SERVER = {
  DEFAULT_PORT: 3001,
  DEFAULT_CORS_ORIGIN: 'http://localhost:3000',
  API_PREFIX: '/api',
  HEALTH_ENDPOINT: '/health',
} as const;

export const ITEMS = {
  INITIAL_COUNT: 1_000_000,
  DEFAULT_LIMIT: 20,
} as const;

export const QUEUE = {
  ADD_BATCH_INTERVAL_MS: 10_000,
  OPERATION_BATCH_INTERVAL_MS: 1_000,
} as const;

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;

export const ERROR_MESSAGES = {
  ID_MUST_BE_INTEGER: 'ID must be an integer',
  ITEM_ALREADY_EXISTS: 'Item already exists or is queued',
  INVALID_ID: 'Invalid ID',
  ITEM_NOT_FOUND: 'Item not found',
  ITEM_ALREADY_SELECTED: 'Item already selected',
  ITEM_NOT_IN_SELECTED: 'Item not in selected list',
  FAILED_TO_SELECT: 'Failed to select item',
  FAILED_TO_DESELECT: 'Failed to deselect item',
  FAILED_TO_REORDER: 'Failed to reorder item',
  ITEM_ID_AND_NEW_INDEX_REQUIRED: 'itemId and newIndex must be numbers',
} as const;

export const SUCCESS_MESSAGES = {
  ITEM_QUEUED: 'Item queued for addition',
  ITEM_SELECTED: 'Item selected',
  ITEM_DESELECTED: 'Item deselected',
  ITEM_REORDERED: 'Item reordered',
} as const;
