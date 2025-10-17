import { scrapeGoogleMaps } from '../services/googleMapsScraper.js';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';

export const scrapeData = async (req, res) => {
  const { query, location, maxResults } = req.body;
  console.log(`Scraping data for: ${query} in ${location}, limit: ${maxResults}`);

  try {
    const data = await scrapeGoogleMaps(query, location, maxResults);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Generate CSV with only name, address, and phone
    const fields = ['name', 'address', 'phone'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filePath = path.join(process.cwd(), 'output.csv');
    fs.writeFileSync(filePath, csv);

    res.status(200).json({
      message: 'Scraping successful',
      count: data.length,
      data,
      downloadLink: '/output.csv',
    });
  } catch (error) {
    console.error("Scraping error:", error.message);
    res.status(500).json({
      message: 'Error scraping data',
      error: error.message,
    });
  }
};
