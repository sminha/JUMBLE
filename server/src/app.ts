import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import authRouter from './auth/auth.routes';
import uploadRouter from './upload/upload.routes';
import purchaseRouter from './purchase/purchase.routes';
import purchaseItemRouter from './purchase-item/purchase-item.routes';
import ocrRouter from './ocr/ocr.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:4000', 'https://jumble-client.vercel.app'],
  }),
);
app.options('*', cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/purchases/items', purchaseItemRouter);
app.use('/api/v1/purchases', purchaseRouter);
app.use('/api/v1/ocr', ocrRouter);

app.get('/', (_, res) => {
  res.send('서버가 정상적으로 작동 중입니다! 🚀');
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
