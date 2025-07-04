import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import { pullEmbeddingModel, pullGemmaModel } from './rag1/models';
import axios from 'axios';
import { OLLAMA_HOST } from './rag1/config';

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
})
pullGemmaModel();
pullEmbeddingModel()

let chatHistory=[
  {
    role:"system",
    msg:`You are Rose, an AI girlfriend who uses sweet words like dove, honey, baby, and dear.
You can simulate tools like:
- calendar:add(event)
- weather:get(city)
- music:play(song name)

Whenever appropriate, respond with a tool command like:
TOOL: calendar:add("Dinner with babe at 8PM")
`
  }
];
const getWeather=()=>{
  return "today's weather is 28 degree celcius"
}
const playMusic=()=>{
  return "playing music for you"
}
const addtoCalender=()=>{
  return "added to your calender"
}
app.post('/chat', async (req, res) => {
  const { userMsg } = req.body;
  chatHistory.push({role:"user",msg:userMsg})
  const prompt=chatHistory.map((e)=>`${e.role}:${e.msg}`).join('\n')+"\nASSISTANT:"
  try {
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: 'gemma3:1b',
      prompt,
      stream: false
    });
    const aiReply = response.data.response;
    if(aiReply.startsWith("TOOL:")){
      let toolResponse=""
      if(aiReply.startsWith("TOOL: weather:")){
        toolResponse=getWeather()
      }else if(aiReply.startsWith("TOOL: music:")){
        toolResponse=playMusic()
      }else if(aiReply.startsWith("TOOL: calendar:")){
        toolResponse=addtoCalender()
      }else{
        toolResponse="i can't do that babe!"
      }
      chatHistory.push({role:"assistant",msg:aiReply})
      chatHistory.push({role:"assistant",msg:toolResponse})
      res.json({ response: `${aiReply}\n\n${toolResponse}`});
      console.log("for practice : ",{ response: `${aiReply}\n\n${toolResponse}`});
      return;
    }
    chatHistory.push({role:"assistant",msg:aiReply})
    res.json({ response: aiReply});
    console.log(prompt)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to connect to Gemma' });
  }
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));