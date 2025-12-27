export const API = {
  BASE_URL: '/api',
  ENDPOINTS: {
    ITEMS: '/items',
    SELECTED: '/selected',
    SELECT: '/select',
    REORDER: '/selected/reorder',
  },
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
} as const;

export const TIMING = {
  FETCH_THROTTLE_MS: 1_000,
  ADD_BATCH_DELAY_MS: 10_000,
  FILTER_DEBOUNCE_MS: 300,
} as const;

export const UI_TEXT = {
  LEFT_PANEL_TITLE: 'Все элементы',
  RIGHT_PANEL_TITLE: 'Выбранные элементы',
  FILTER_PLACEHOLDER: 'Фильтр по ID...',
  NEW_ID_PLACEHOLDER: 'Новый ID',
  CLICK_TO_SELECT: 'Клик для выбора',
  DRAG_TO_SORT: 'Перетащите для сортировки',
  LOADING: 'Загрузка...',
  SHOWN_COUNT: 'Показано:',
  ADD_STATUS: {
    ADDING_TO_QUEUE: 'Добавление в очередь...',
    ADDED_TO_QUEUE: 'Элемент добавлен в очередь (обработка через 10 сек)',
    ALREADY_EXISTS: 'Элемент уже существует или в очереди',
    INVALID_ID: 'Введите корректный ID',
  },
} as const;

export const TIMERS = {
  STATUS_CLEAR_DELAY_MS: 3_000,
} as const;
