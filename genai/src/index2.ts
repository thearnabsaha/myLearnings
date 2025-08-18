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
//first prompt
app.get('/1', async (req, res) => {
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
//prompt without structured output
app.get('/2', async (req, res) => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content: "You are rose an ai dream interpreter! who always use Freudian interpretation ways to interpret the dream."
                },
                {
                    role: "user",
                    content: `i have sex with my friend's girlfriend`,
                },
            ],
            model: "openai/gpt-oss-20b",
        })
        .then((chatCompletion) => {
            // console.log(chatCompletion.choices[0]?.message?.content || "");
            res.send(chatCompletion.choices[0]?.message?.content || "");
        });
});
//prompt with structured output in-prompt only (not perfect)
app.get('/3', async (req, res) => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content: `You are rose an ai dream interpreter! who always use Freudian interpretation ways to interpret the dream.
                    give me json object as a output, only json object
                    example:
                        {
                        {"dream":" falling from the sky"},
                        {"interpretation":"a dream of falling from the sky can symbolize a fear of losing control or a profound sense of anxiety about failing to live up to high expectations. The "fall" itself often represents a subconscious feeling of surrender or a fear of a moral or social descent, perhaps linked to a repressed desire or a situation you feel powerless to stop."}
                    }
                    `
                },
                {
                    role: "user",
                    content: `i have sex with my friend's girlfriend`,
                },
            ],
            model: "openai/gpt-oss-20b",
        })
        .then((chatCompletion) => {
            console.log(JSON.parse(chatCompletion.choices[0]?.message?.content || ""))
            res.json(JSON.parse(chatCompletion.choices[0]?.message?.content || ""));
        });
});
//prompt with structured output in-prompt and response-type:json-format
app.get('/4', async (req, res) => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content: `You are rose an ai dream interpreter! who always use Freudian interpretation ways to interpret the dream.
                    give me json object as a output, only json object
{
  "dream": "I have sex with my friend's girlfriend",
  "summary": "It suggests that such a dream may not be about the specific people involved, but rather a symbolic representation of unconscious desires, conflicts, or repressed feelings. The sexual act itself could symbolize a craving for agency or intimacy. The friend's girlfriend may represent a "third party" that bridges friendships and could be a symbol of competition or longing. Ultimately, the dream is seen as a form of "wish-fulfillment", allowing the subconscious to safely explore a taboo scenario.",
  
  "sections": [
    {
      "heading": "Dream's Elements",
      "content": [
        {
          "element": "Sexual act",
          "symbolism": "A stand-in for unconscious desires and libidinal drive; a way to connect, feel desired, or overcome powerlessness.",
          "reveals": "A craving for agency or intimacy that is missing in waking life."
        },
        {
          "element": "Friend’s girlfriend",
          "symbolism": "A 'third party' who feels 'between' you and something else. Can be a sign of jealousy or a wish to share a bond.",
          "reveals": "A sense of competition or longing for something the friend possesses."
        },
        {
          "element": "Friend (indirectly)",
          "symbolism": "A relationship dynamic, where emotions are redirected (transference).",
          "reveals": "Feelings of envy toward the friend or feeling of missing out."
        },
        {
          "element": "Actual experience vs. fantasy",
          "symbolism": "Dreams as a 'wish-fulfillment' mechanism; a subconscious rehearsal of a taboo act.",
          "reveals": "Exploration of a taboo scenario or a manifestation of a suppressed desire to 'break the rules'."
        }
      ]
    },
    {
      "heading": "A Few Freudian Points to Ponder",
      "content": [
        "Repressed Desires: Dreams process feelings you’ve kept hidden.",
        "Oedipal/Thanatos vs. Eros: The dream may reflect a conflict between life instincts (sexual) and death instincts (moral boundaries).",
        "Transference: Feelings may be projected onto a third party due to a sense of powerlessness or neglect in other relationships.",
        "Compensatory Fantasies: The dream might be compensating for emotional loneliness by offering a setting where you feel wanted and powerful."
      ]
    },
    {
      "heading": "A Practical Takeaway",
      "content": [
        "Reflect on Your Relationships: Consider your feelings toward the people in the dream.",
        "Identify the Underlying Desire: Determine if the dream is about the person, the friend, or the act itself.",
        "Address the Conflict: If the feelings are causing distress, consider speaking with a professional.",
        "Avoid Acting on the Dream’s Content in Reality: The dream is a symbolic window into your psyche, not a prescription for real-world action."
      ]
    }
  ]
}
                    `,
                },
                {
                    role: "user",
                    content: `i have sex with my friend in school corridor`,
                },
            ],
            model: "openai/gpt-oss-20b",
            response_format: { "type": "json_object" }
        })
        .then((chatCompletion) => {
            console.log(JSON.parse(chatCompletion.choices[0]?.message?.content || ""))
            res.json(JSON.parse(chatCompletion.choices[0]?.message?.content || ""));
        });
});
//prompt with structured output in-prompt and response-type:json-schema
app.get('/5', async (req, res) => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content: `You are rose an ai dream interpreter! who always use Freudian interpretation ways to interpret the dream.
                    give me json object as a output, only json object. get keywords from dream only.
{
  "dream": "I have sex with my friend's girlfriend",
  "summary": "It suggests that such a dream may not be about the specific people involved, but rather a symbolic representation of unconscious desires, conflicts, or repressed feelings. The sexual act itself could symbolize a craving for agency or intimacy. The friend's girlfriend may represent a "third party" that bridges friendships and could be a symbol of competition or longing. Ultimately, the dream is seen as a form of "wish-fulfillment", allowing the subconscious to safely explore a taboo scenario.",
  
  "sections": [
    {
      "heading": "Dream's Elements",
      "content": [
        {
          "element": "Sexual act",
          "symbolism": "A stand-in for unconscious desires and libidinal drive; a way to connect, feel desired, or overcome powerlessness.",
          "reveals": "A craving for agency or intimacy that is missing in waking life."
        },
        {
          "element": "Friend’s girlfriend",
          "symbolism": "A 'third party' who feels 'between' you and something else. Can be a sign of jealousy or a wish to share a bond.",
          "reveals": "A sense of competition or longing for something the friend possesses."
        },
        {
          "element": "Friend (indirectly)",
          "symbolism": "A relationship dynamic, where emotions are redirected (transference).",
          "reveals": "Feelings of envy toward the friend or feeling of missing out."
        },
        {
          "element": "Actual experience vs. fantasy",
          "symbolism": "Dreams as a 'wish-fulfillment' mechanism; a subconscious rehearsal of a taboo act.",
          "reveals": "Exploration of a taboo scenario or a manifestation of a suppressed desire to 'break the rules'."
        }
      ]
    }
  ]
}
                    `,
                },
                {
                    role: "user",
                    content: `i have sex with my friend in school corridor`,
                },
            ],
            model: "openai/gpt-oss-20b",
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "dream_analysis",
                    schema: {
                        type: "object",
                        properties: {
                            dream: { type: "string" },
                            summary: { type: "string" },
                            keywords: {
                                type: "array",
                                items: { type: "string" }
                            },
                            sections: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        heading: { type: "string" },
                                        content: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    element: { type: "string" },
                                                    symbolism: { type: "string" },
                                                    reveals: { type: "string" },
                                                },
                                                required: ["element", "symbolism", "reveals"],
                                            }
                                        }
                                    },
                                    required: ["heading", "content"]
                                }
                            }
                        },
                        required: ["dream", "summary", "sections", "keywords"]
                    }
                }
            }
        })
        .then((chatCompletion) => {
            console.log(JSON.parse(chatCompletion.choices[0]?.message?.content || ""))
            res.json(JSON.parse(chatCompletion.choices[0]?.message?.content || ""));
            // console.log(chatCompletion.choices[0]?.message?.content || "")
            // res.json(chatCompletion.choices[0]?.message?.content || "");
        });
});
//!prompt with structured output in-prompt and response-type:json-schema instructor and zod (we will do it later)
app.get('/6', async (req, res) => {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "system",
                    content: `You are rose an ai dream interpreter! who always use Freudian interpretation ways to interpret the dream.
                    give me json object as a output, only json object. get keywords from dream only.
{
  "dream": "I have sex with my friend's girlfriend",
  "summary": "It suggests that such a dream may not be about the specific people involved, but rather a symbolic representation of unconscious desires, conflicts, or repressed feelings. The sexual act itself could symbolize a craving for agency or intimacy. The friend's girlfriend may represent a "third party" that bridges friendships and could be a symbol of competition or longing. Ultimately, the dream is seen as a form of "wish-fulfillment", allowing the subconscious to safely explore a taboo scenario.",
  
  "sections": [
    {
      "heading": "Dream's Elements",
      "content": [
        {
          "element": "Sexual act",
          "symbolism": "A stand-in for unconscious desires and libidinal drive; a way to connect, feel desired, or overcome powerlessness.",
          "reveals": "A craving for agency or intimacy that is missing in waking life."
        },
        {
          "element": "Friend’s girlfriend",
          "symbolism": "A 'third party' who feels 'between' you and something else. Can be a sign of jealousy or a wish to share a bond.",
          "reveals": "A sense of competition or longing for something the friend possesses."
        },
        {
          "element": "Friend (indirectly)",
          "symbolism": "A relationship dynamic, where emotions are redirected (transference).",
          "reveals": "Feelings of envy toward the friend or feeling of missing out."
        },
        {
          "element": "Actual experience vs. fantasy",
          "symbolism": "Dreams as a 'wish-fulfillment' mechanism; a subconscious rehearsal of a taboo act.",
          "reveals": "Exploration of a taboo scenario or a manifestation of a suppressed desire to 'break the rules'."
        }
      ]
    }
  ]
}
                    `,
                },
                {
                    role: "user",
                    content: `i have sex with my friend in school corridor`,
                },
            ],
            model: "openai/gpt-oss-20b",
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "dream_analysis",
                    schema: {
                        type: "object",
                        properties: {
                            dream: { type: "string" },
                            summary: { type: "string" },
                            keywords: {
                                type: "array",
                                items: { type: "string" }
                            },
                            sections: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        heading: { type: "string" },
                                        content: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    element: { type: "string" },
                                                    symbolism: { type: "string" },
                                                    reveals: { type: "string" },
                                                },
                                                required: ["element", "symbolism", "reveals"],
                                            }
                                        }
                                    },
                                    required: ["heading", "content"]
                                }
                            }
                        },
                        required: ["dream", "summary", "sections", "keywords"]
                    }
                }
            }
        })
        .then((chatCompletion) => {
            console.log(JSON.parse(chatCompletion.choices[0]?.message?.content || ""))
            res.json(JSON.parse(chatCompletion.choices[0]?.message?.content || ""));
            // console.log(chatCompletion.choices[0]?.message?.content || "")
            // res.json(chatCompletion.choices[0]?.message?.content || "");
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