import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { interpretEmotion } from './models/interpretEmotion';
import { prisma } from './db/client';
const morganFormat = ':method :url :status :response-time ms';
import interpretRoutes from './routes/interpret.route';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.use('/interpret', interpretRoutes);

app.get('/', (req, res) => {
    res.send('hello from simple server :)');
});
app.get('/health', async (req, res) => {
  const start = Date.now();
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date(),
    responseTime: `${Date.now() - start}ms`,
  };
  res.status(200).json(healthcheck);
});
// app.get('/analytics/tag-counts', async (req, res) => {
//   try {
//     const tagCounts = await prisma.tag.findMany({
//       select: {
//         name: true,
//         _count: { select: { dreams: true } }
//       },
//       orderBy: { dreams: { _count: 'desc' } },
//       take: 20
//     });
//     res.json(tagCounts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to fetch analytics" });
//   }
// });


app.listen(port, () => console.log('> Server is up and running on port: ' + port));