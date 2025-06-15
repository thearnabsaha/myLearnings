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
import {  generateQuestions, interpretDream } from './models/interactiveFreud';


const morganFormat = ':method :url :status :response-time ms';

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
app.post('/freud', async (req, res) => {
    const result = await interpretEmotion(req.body.dream);
    res.send(result);
});

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

let questions: string[] = [];

app.post('/start', async (req, res) => {
  const { dream } = req.body;
  if (!dream){
    res.status(400).json({ error: 'Dream is required' });
    return
  }  
  try {
    questions = await generateQuestions(dream);
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

app.post('/interpret', async (req, res) => {
  const { dream, answers } = req.body;
  if (!dream || !answers){
    res.status(400).json({ error: 'Dream and answers required' });
    return
  } 
  try {
    const interpretation = await interpretDream(dream, answers, questions);
    res.json({ interpretation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate interpretation' });
  }
});


app.listen(port, () => console.log('> Server is up and running on port: ' + port));