/* eslint-disable no-console */
const scrapeQuotesReddit = require('./scrapeQuotesReddit');
const insertQuotes = require('./insertQuotes');

const today = new Date();
const isSunday = today.getDay() === 0; // 0 = Sunday

if (!isSunday) {
  console.log('Not Sunday, skipping weekly job.');
  process.exit(0);
}

const insertQuotesReddit = async () => {
  try {
    const quotes = await scrapeQuotesReddit();
    await insertQuotes(quotes);
  } catch (error) {
    console.error('Error during scraping or inserting quotes:', error);
  }
};

insertQuotesReddit().catch(console.error);
