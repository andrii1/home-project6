/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');

/* Get all topics */
const getKeywords = async () => {
  try {
    const keywords = await knex('keywords');
    return keywords;
  } catch (error) {
    return error.message;
  }
};

// Get topics by Category
const getKeywordsByQuote = async (quote) => {
  try {
    const keywords = await knex('keywords')
      .select('keywords.*')
      .join('quotes', 'keywords.quote_id', '=', 'quotes.id')
      .where({ quote_id: quote });
    return keywords;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getKeywords,
  getKeywordsByQuote,
};
