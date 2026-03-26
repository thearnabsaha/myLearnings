import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3001;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { agent } from './graph';
// import { a } from './tools';

// npm install express cors cookie-parser dotenv helmet morgan
// npm install -D @types/express @types/cors @types/cookie-parser @types/morgan

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors());

// app.options('*', cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true,
// }));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.get('/', (req, res) => {
    // a()
    res.send('hello from simple server :)');
});
app.post('/chat', async (req, res) => {
    const inputMessage = req.body.inputMessage as string
    const threadId = req.body.threadId as string
    const userId = req.body.userId as string
    const answer = await agent(inputMessage, threadId, userId)

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.flushHeaders();
    for await (const chunk of answer) {
        const content = chunk[0]?.content;
        if (content && typeof content === "string") {
            res.write(`data: ${JSON.stringify({ message: content })}\n\n`);
        }
        req.on("close", () => {
            res.end();
        });
    }

    // res.send(answer);
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));