import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello from simple server :)');
});

app.listen(port, () => console.log('> Server is up and running on port: ' + port));