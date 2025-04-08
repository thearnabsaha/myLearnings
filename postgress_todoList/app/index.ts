import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import pg, { Client } from 'pg';
const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_ieo2mEHcRpf9@ep-curly-dream-a87ml0fn-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
});

const getUsersTable = async () => {
  await client.connect();
  const users = await client.query(`SELECT * FROM users WHERE email = $1`, ["arnab1@gmail.com"]);
  console.log(users.rows);
};
getUsersTable();

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


app.listen(port, () => console.log('> Server is up and running on port: ' + port));