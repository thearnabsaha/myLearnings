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


const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// app.options('*', cors({
//   origin: process.env.CORS_ORIGIN,
//   credentials: true,
// }));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.get('/', async (req, res) => {
    const result = await agent.invoke({
        messages: [new HumanMessage("what is a llm??")],
    });
    console.log(result.messages[result.messages.length - 1].content)
    res.send(result.messages[result.messages.length - 1].content);
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));