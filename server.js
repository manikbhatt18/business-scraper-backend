import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scraperRoutes from './routes/scraperRoutes.js';
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());
app.use('/api', scraperRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
