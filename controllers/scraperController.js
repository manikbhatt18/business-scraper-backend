import { scrapeGoogleMaps } from '../services/googleMapsScraper.js';
import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';

export const scrapeData = async (req, res) => {
  let { query, location, maxResults } = req.body;
  console.log(`Scraping data for: ${query} in ${location}, limit: ${maxResults}`);

  //Validate input
  if (!query || !location) {
    return res.status(400).json({ message: "Query and location are required" });
  }

  //Enforce maxResults cap between 1 and 20
  maxResults = Number(maxResults);
  if (isNaN(maxResults) || maxResults < 1) {
    return res.status(400).json({ message: "maxResults must be at least 1" });
  }
  if (maxResults > 20) {
    maxResults = 20; // or you could throw an error instead of capping
  }

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