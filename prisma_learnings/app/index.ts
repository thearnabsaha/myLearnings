import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const morganFormat = ':method :url :status :response-time ms';
import { z } from 'zod';
const SignupSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
    age: z.number().min(18).max(100),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' }),
});
const SigninSchema = z.object({
    username: z.string().min(3, { message: 'Username must be at least 3 characters long' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
        .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
        .regex(/[0-9]/, { message: 'Password must contain at least one number' })
        .regex(/[@$!%*?&]/, { message: 'Password must contain at least one special character' }),
});
app.use(
    morgan(morganFormat)
);

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
app.post('/signup', async (req, res) => {
    try {
        const result = SignupSchema.safeParse(req.body);
        if (!result.success) {
            res.send(result.error.format());
        } else {
            const user = await client.user.findFirst({
                where: {
                    username: req.body.username
                }
            })
            if (user) {
                res.send("User Already Exists!")
            } else {
                await client.user.create({
                    data: {
                        username: req.body.username,
                        password: req.body.password,
                        age: req.body.age,
                    }
                });
                res.send("Signed Up Successfully!")
            }
        }

    } catch (error) {
        res.send(error)
    }
});
app.post('/signin', async (req, res) => {
    try {
        const result = SigninSchema.safeParse(req.body);
        if (!result.success) {
            res.send(result.error.format());
        } else {
            const user = await client.user.findFirst({
                where: {
                    username: req.body.username,
                }
            });
            if (!user) {
                res.send("User Doesn't Exists")
                return;
            }
            if (user?.password !== req.body.password) {
                res.send("Invalid Credentials")
            } else {
                res.send("Signed In Successfully!")
            }
        }
    } catch (error) {
        res.send(error)
    }
});
app.post('/todo', async (req, res) => {
    try {
        await client.todo.create({
            data: {
                title: req.body.title,
                description: req.body.description,
                userId: req.body.userId,
                isDone: req.body.isDone
            }
        })
        res.send("Todo Added")
    } catch (error) {
        res.send(error)
    }
});
app.get('/todo', async (req, res) => {
    try {
        const todos = await client.todo.findMany({
            where: {
                userId: req.body.userId,
            }
        })
        res.send(todos)
    } catch (error) {
        res.send(error)
    }
});
app.get('/todo/:id', async (req, res) => {
    try {
        const todos = await client.todo.findFirst({
            where: {
                id: Number(req.params.id),
                userId: req.body.userId,
            }
        })
        res.send(todos)
    } catch (error) {
        res.send(error)
    }
});
app.put('/todo/:id', async (req, res) => {
    try {
        await client.todo.update({
            where: {
                id: Number(req.params.id)
            },
            data: {
                title: req.body.title,
                description: req.body.description,
                userId: req.body.userId,
                isDone: req.body.isDone
            }
        });
        res.send("Updated Successfully")
    } catch (error) {
        res.send(error)
    }
});
app.delete('/todo', async (req, res) => {
    try {
        await client.todo.deleteMany({
            where: {
                userId: req.body.userId,
            }
        })
        res.send("Todo Deleted Successfully")
    } catch (error) {
        res.send(error)
    }
});
app.delete('/todo/:id', async (req, res) => {
    try {
        await client.todo.delete({
            where: {
                id: Number(req.params.id),
                userId: req.body.userId,
            }
        })
        res.send("All Todos Deleted Successfully")
    } catch (error) {
        res.send(error)
    }
});
app.listen(port, () => console.log('> Server is up and running on port: ' + port));