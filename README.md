# Item Manager

Fullstack приложение для управления списком из 1 000 000 элементов с выбором и сортировкой.

## Технологии

### Backend
- Node.js 22
- Express.js
- TypeScript
- ESLint
- CORS

### Frontend
- React 18
- TypeScript
- Vite
- shadcn/ui компоненты
- Zustand (state management)
- @dnd-kit (drag & drop)
- TailwindCSS

## Функционал

- **Левая панель**: все элементы (кроме выбранных)
  - Фильтрация по ID
  - Infinite scroll (по 20 элементов)
  - Добавление новых элементов с любым ID

- **Правая панель**: выбранные элементы
  - Фильтрация по ID
  - Drag & Drop сортировка
  - Infinite scroll (по 20 элементов)
  - Сохранение состояния между обновлениями страницы

## Запуск

### Разработка

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (в отдельном терминале)
cd frontend
npm install
npm run dev
```

### Docker (для Coolify)

```bash
docker-compose up --build
```

Приложение будет доступно:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

| Method | Endpoint | Описание |
|--------|----------|----------|
| GET | /api/items | Получить элементы (с пагинацией и фильтром) |
| GET | /api/selected | Получить выбранные элементы |
| POST | /api/items | Добавить новый элемент |
| POST | /api/select/:id | Выбрать элемент |
| DELETE | /api/select/:id | Убрать из выбранных |
| PUT | /api/selected/reorder | Изменить порядок |

## Батчинг запросов

- Добавление элементов: очередь с flush раз в 10 секунд
- Остальные операции: очередь с flush раз в 1 секунду
- Дедупликация: одинаковые операции не добавляются повторно

## Деплой на Coolify

1. Загрузить проект в Git репозиторий
2. В Coolify создать новый проект из Docker Compose
3. Указать путь к `docker-compose.yml`
4. Настроить домены для frontend и backend
5. Запустить деплой
