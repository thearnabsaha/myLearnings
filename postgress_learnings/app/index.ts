import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import pg, { Client } from 'pg';
// npm i pg @types/pg
const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_ieo2mEHcRpf9@ep-curly-dream-a87ml0fn-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"
});

// const createUsersTable = async () => {
//   await client.connect();
//   const result = await client.query(`
//     CREATE TABLE IF NOT EXISTS users (
//       id SERIAL PRIMARY KEY,
//       username VARCHAR(50) UNIQUE NOT NULL,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//     );
//   `);
//   console.log(result);
// };
// createUsersTable();

// const data = [
//   { username: "arnabsaha", email: "arnab1@gmail.com", password: 123 },
//   { username: "arnabsaha1", email: "arnab2@gmail.com", password: 123 },
//   { username: "arnabsaha2", email: "arnab3@gmail.com", password: 123 }
// ];

// const fillUsersTable = async () => {
//   await client.connect();
//   for (const e of data) {
//     await client.query(`
//       INSERT INTO users (username, email, password) VALUES ($1, $2, $3)
//     `, [e.username, e.email, e.password]);
//   }
// };
// fillUsersTable();

const getUsersTable = async () => {
  await client.connect();
  const users = await client.query(`SELECT * FROM users WHERE email = $1`, ["arnab1@gmail.com"]);
  console.log(users.rows);
};
getUsersTable();

// const deleteUsersTable = async () => {
//   await client.connect();
//   const users = await client.query(`DELETE FROM users WHERE email = $1`, ["arnab1@gmail.com"]);
//   console.log(users.rows);
// };
// deleteUsersTable();

// const updateUsersTable = async () => {
//   await client.connect();
//   const users = await client.query(`UPDATE users SET username = $2 WHERE email = $1`, ["arnab2@gmail.com", "pokemon"]);
//   console.log(users.rows);
// };
// updateUsersTable();
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