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

// async function createUser() {
//   await client.user.createMany({
//     data: [
//       {
//         username: "Alice",
//         password: "1234",
//         age: 20,
//         city: "New York"
//       },
//       {
//         username: "Bob",
//         password: "12345",
//         age: 25,
//         city: "San Francisco"
//       }
//     ]
//   });
// }
// createUser();

// async function deleteUser() {
//   await client.user.delete({
//     where: {
//       id: 1
//     }
//   });
// }
// deleteUser();

// async function updateUser() {
//   await client.user.update({
//     where: {
//       id: 1
//     },
//     data: {
//       username: "GKSingh",
//     }
//   });
// }
// updateUser();

// async function readUser() {
//   const user = await client.user.findFirst({
//     where: {
//       id: 7
//     },
//     include: {
//       todos: true
//     }
//   });
//   console.log(user);
// }
// readUser();
const morganFormat = ':method :url :status :response-time ms';

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
        const user = await client.user.findFirst({
            where:{
                username:req.body.username
            }
        })
        if(user){
            res.send("User Already Exists!")
        }else{
            await client.user.create({
                data:{
                    username: req.body.username,
                    password: req.body.password,
                    age: req.body.age,
                    city: req.body.city
                }
            });
            res.send("Signed Up Successfully!")
        }
    } catch (error) {
        res.send(error)
    }
});
app.post('/signin', async (req, res) => {
    try {
        const user=await client.user.findFirst({
            where:{
                username: req.body.username,
            }
        });
        if(!user){
            res.send("User Doesn't Exists")
            return;
        }
        if(user?.password!==req.body.password){
            res.send("Invalid Credentials")
        }else{
            res.send("Signed In Successfully!")
        }
    } catch (error) {
        res.send(error)
    }
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));