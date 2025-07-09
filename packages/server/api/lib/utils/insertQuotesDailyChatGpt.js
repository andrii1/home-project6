/* eslint-disable no-console */
const scrapeQuotesChatGpt = require('./scrapeQuotesChatGpt');
const insertQuotes = require('./insertQuotes');

const insertQuotesChatGpt = async () => {
  try {
    const quotes = await scrapeQuotesChatGpt();
    await insertQuotes(quotes);
  } catch (error) {
    console.error('Error during scraping or inserting quotes:', error);
  }
};

insertQuotesChatGpt().catch(console.error);
