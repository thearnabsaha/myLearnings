import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dreamRoutes from './routes/dream.routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/dream', dreamRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`DreamFlow API running on port ${PORT}`);
});
