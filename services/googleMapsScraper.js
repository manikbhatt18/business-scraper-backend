// import { ApifyClient } from 'apify-client';
// import dotenv from 'dotenv';
// dotenv.config();

// export async function scrapeGoogleMaps(query, location) {
//   try {
//     const client = new ApifyClient({
//       token: process.env.APIFY_API_TOKEN,
//     });

//     // Run Google Maps Scraper actor
//     const run = await client.actor('notable_involvement/my-actor').call({
//       search: query,
//       maxCrawledPlaces: 20
//     });

//     const { items } = await client.dataset(run.defaultDatasetId).listItems();

//     // Keep only the required fields
//     const results = items.map((item) => ({
//       name: item.title || "N/A",
//       address: item.address || "N/A",
//       phone: item.phone || "N/A",
//     }));

//     return results;
//   } catch (err) {
//     console.error("Apify Scraper Error:", err);
//     throw new Error("Failed to fetch Google Maps data");
//   }
// }
// services/googleMapsScraper.js


import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the Apify client
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN, // from your .env
});

export const scrapeGoogleMaps = async (searchQuery, location = "India", maxResults = 10) => {
  try {
    console.log(`Scraping: ${searchQuery} in ${location}, max: ${maxResults}`);

    const input = {
      searchStringsArray: [searchQuery],
      locationQuery: location,
      maxCrawledPlacesPerSearch: maxResults, 
      language: "en",
      scrapePlaceDetailPage: true,
      scrapeContacts: true,
    };

    const run = await client.actor("compass/crawler-google-places").call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    const results = items.map(place => ({
      name: place.title || place.name || "N/A",
      address: place.address || "N/A",
      phone: place.phone || "N/A",
    }));

    console.log(`Found ${results.length} places`);
    return results;
  } catch (error) {
    console.error("Error scraping Google Maps:", error);
    throw new Error("Failed to fetch data from Apify");
  }
};