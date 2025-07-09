/* eslint-disable no-console */
const scrapeQuotesReddit = require('./scrapeQuotesReddit');
const insertQuotes = require('./insertQuotes');

const insertQuotesReddit = async () => {
  try {
    const quotes = await scrapeQuotesReddit();
    await insertQuotes(quotes);
  } catch (error) {
    console.error('Error during scraping or inserting quotes:', error);
  }
};

insertQuotesReddit().catch(console.error);
