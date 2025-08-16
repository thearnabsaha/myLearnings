import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { Groq } from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


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





// app.get('/', (req, res) => {
//     res.send('hello from simple server :)');
// });
app.get('/', async (req, res) => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "user",
                    content: "hi",
                },
            ],
            model: "openai/gpt-oss-20b",
        })
        .then((chatCompletion) => {
            // console.log(chatCompletion.choices[0]?.message?.content || "");
            res.send(chatCompletion.choices[0]?.message?.content || "");
        });
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

app.listen(port, () => console.log('> Server is up and running on port: ' + port));