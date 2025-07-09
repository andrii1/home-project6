/* eslint-disable no-console */
const scrapeQuotesSite = require('./scrapeQuotesSite');
const insertQuotes = require('./insertQuotes');

const insertQuotesSite = async () => {
  try {
    const quotes = await scrapeQuotesSite();
    await insertQuotes(quotes);
  } catch (error) {
    console.error('Error during scraping or inserting quotes:', error);
  }
};

insertQuotesSite().catch(console.error);
