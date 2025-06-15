import { Request, Response } from 'express';
import { handleDreamInput, getDreamHistory, resetDreamSession } from '../services/dream.service';

export const startDream = async (req: Request, res: Response) => {
  const { userId, input } = req.body;
  const reply = await handleDreamInput(userId, input);
  res.json({ reply });
};

export const respondDream = async (req: Request, res: Response) => {
  const { userId, input } = req.body;
  const reply = await handleDreamInput(userId, input);
  res.json({ reply });
};

export const getHistory = (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const history = getDreamHistory(userId);
  res.json({ history });
};

export const resetSession = (req: Request, res: Response) => {
  const userId = req.body.userId;
  resetDreamSession(userId);
  res.json({ message: 'Session reset.' });
};
