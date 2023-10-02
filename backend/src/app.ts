import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from './middleware/cors';
import { createDirectory } from './lib/storage';
import router from './routes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

createDirectory();

app.use(cors);

app.use('/', router);

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
