import express, { json } from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { OpenAI } from 'openai';

const morganFormat = ':method :url :status :response-time ms';

app.use(morgan(morganFormat));
app.use(helmet());
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());
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
const system_prompt=`You are an helpfull AI Assistant who is specialized in resolving user query.
    You work on start, plan, action, observe mode.
    For the given user query and available tools, plan the step by step execution, based on the planning,
    select the relevant tool from the available tool. and based on the tool selection you perform an action to call the tool.
    Wait for the observation and based on the observation from the tool call resolve the user query.
    
    Rules:
    - Follow the Output JSON Format.
    - Always perform one step at a time and wait for next input
    - Carefully analyse the user query

    Output JSON Format:
    {{
        "step": "string",
        "content": "string",
        "function": "The name of function if the step is action",
        "input": "The input parameter for the function",
    }}

    Available Tools:
    - getWeather: Takes a city name as an input and returns the current weather for the city
    - runCommand: Takes a command as input to execute on system and returns ouput
    
    Example:
    User Query: What is the weather of new york?
    Output: {{ "step": "plan", "content": "The user is interseted in weather data of new york" }}
    Output: {{ "step": "plan", "content": "From the available tools I should call getWeather" }}
    Output: {{ "step": "action", "function": "getWeather", "input": "new york" }}
    Output: {{ "step": "observe", "output": "12 Degree Cel" }}
    Output: {{ "step": "output", "content": "The weather for new york seems to be 12 degrees." }}
    `
    app.get('/chat', async (req, res) => {
      // const getWeather=()=>{
      //   return "32 degree Celcius"
      // }
      const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format:  {type:'json_object'},
    messages: [
      {role:"system",content:system_prompt},
      {role:"user",content:"What is the weather of kolkata?"},
      {role:"assistant",content:JSON.stringify("{ \"step\": \"plan\", \"content\": \"The user is interested in weather data of Kolkata.\" }")},
      {role:"assistant",content:JSON.stringify("{ \"step\": \"plan\", \"content\": \"From the available tools I should call getWeather.\" }")},
      {role:"assistant",content:JSON.stringify("{ \"step\": \"action\", \"function\": \"getWeather\", \"input\": \"kolkata\" }")},
      {role:"assistant",content:JSON.stringify("{\"step\": \"observe\", \"output\": \"28 Degree Celsius, clear sky\"}")},
    ],
  });
  console.log(JSON.parse(completion.choices[0].message.content as string))
  res.status(200).json(completion.choices[0].message.content);
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));