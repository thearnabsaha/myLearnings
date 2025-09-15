import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3001;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { agent } from './agent';
import { Prisma, PrismaClient } from '@prisma/client';
import { email } from 'zod';
import { createCalenderEvents, getCalenderEvents } from './tools';
import { google } from 'googleapis';
const prisma = new PrismaClient();
const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors());

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

app.post('/chat', async (req, res) => {
    const inputMessage = req.body.inputMessage as string
    const threadId = req.body.threadId as string
    const email = req.body.email as string
    const answer = await agent(inputMessage, threadId, email)
    res.send(answer);
});
app.get('/token', async (req, res) => {

    // const meet = await createCalenderEvents("thearnabsaha201@gmail.com")
    const meet = await getCalenderEvents("thearnabsaha201@gmail.com")

    res.send(meet);
    // res.send("hi");
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));


