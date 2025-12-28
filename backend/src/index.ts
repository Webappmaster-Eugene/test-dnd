import express from 'express';
import cors from 'cors';
import itemsRouter from './routes/items.js';
import { SERVER, HTTP_METHODS } from './constants/index.js';

const app = express();
const PORT = process.env.PORT || SERVER.DEFAULT_PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN || SERVER.DEFAULT_CORS_ORIGIN;

app.use(cors({
  origin: CORS_ORIGIN,
  methods: [...HTTP_METHODS],
  credentials: true,
}));

app.use(express.json());

app.use(SERVER.API_PREFIX, itemsRouter);

app.get(SERVER.HEALTH_ENDPOINT, (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: ${CORS_ORIGIN}`);
});
