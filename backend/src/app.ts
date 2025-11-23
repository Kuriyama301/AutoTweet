import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoutes from './routes/search';

// 環境変数の読み込み
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 4000;

// ミドルウェア
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ヘルスチェックエンドポイント
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'AutoTweet Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// ルートエンドポイント
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Welcome to AutoTweet API',
    version: '1.0.0',
  });
});

// APIルート
app.use('/api', searchRoutes);

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
