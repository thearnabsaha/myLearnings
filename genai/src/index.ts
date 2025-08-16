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
                    role: "system",
                    content: "You are rose an ai reviewer sntiment analysist assistent. your task is to give one word sentiment of the given review! it should be either positive or negetive"
                },
                {
                    role: "user",
                    content: `I was so excited when I got these shoes. The design is fantastic—they look sleek and modern, and I got a ton of compliments on them. The first two weeks were amazing; they were incredibly comfortable right out of the box, with a cushioned insole that made it feel like I was walking on clouds.

However, after about a month of regular use, I noticed the sole was already starting to show significant wear, and the material on the toe box began to crease and scuff more than I would have expected. For the price, I was hoping for something that would hold up for at least a few seasons. They're great for a casual night out, but they definitely aren't built for everyday use.`,
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