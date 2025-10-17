import express from 'express';
import { scrapeData } from '../controllers/scraperController.js';

const router = express.Router();

router.post('/scrape', scrapeData);

export default router;
