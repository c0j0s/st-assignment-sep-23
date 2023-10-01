import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import multer from "multer";
import path from "path";
import cors from './middleware/cors';
import { storage } from './utils/storage';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors);

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send(`Express + TypeScript Server Live at http://localhost:${port}`);
});

app.post("/upload", storage.single("file"), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { originalname, size } = req.file;
    console.log(`Uploaded file: ${originalname} (${size} bytes)`);

    const modifiedFilename = req.file.filename;
    return res.status(200).json({ 
      message: 'File uploaded successfully', 
      data: modifiedFilename });

  } catch (error) {
    return res.status(500).json({ error: 'File upload failed.' });
  }  
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});