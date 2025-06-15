import express from 'express';
import { startDream, respondDream, getHistory, resetSession } from '../controllers/dream.controller';

const router = express.Router();

router.post('/start', startDream);
router.post('/respond', respondDream);
router.get('/history', getHistory);
router.post('/reset', resetSession);

export default router;
