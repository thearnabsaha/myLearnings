import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3001;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
// import { agent } from './agent';
import { prisma } from './utils/prisma';

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors());

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// app.post('/chat', async (req, res) => {
//     const inputMessage = req.body.inputMessage as string
//     const threadId = req.body.threadId as string
//     const answer = await agent(inputMessage, threadId)
//     res.send(answer);
// });
app.post('/signup', async (req, res) => {
    const user = await prisma.user.createMany({
        data: req.body
    });
    res.send(user);
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));


