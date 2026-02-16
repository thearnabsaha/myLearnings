import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3001;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { HumanMessage } from '@langchain/core/messages';
import { agent } from './graph';
import prisma from './lib/prisma';

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors());

// app.options('*', cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true,
// }));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.get('/', async (req, res) => {
    res.send("hi")
});
app.post('/chat', async (req, res) => {
    const inputMessage = req.body.inputMessage as string
    const threadId = req.body.threadId as string
    const answer = await agent(inputMessage, threadId)
    res.send(answer);
});
app.post('/signup', async (req, res) => {
    try {
        const { email, name } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const user = await prisma.user.create({
            data: {
                email,
                name
            }
        });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});
app.get('/login', async (req, res) => {
    res.send("hi")
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));