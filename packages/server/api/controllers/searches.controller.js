/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');

/* Get all topics */
const getSearches = async () => {
  try {
    const searches = await knex('searches');
    // .select(
    //   'topics.id as id',
    //   'topics.title as title',
    //   'topics.category_id as categoryId',
    //   'categories.title as categoryTitle',
    // )
    // .join('searches', 'searches.search_term_id', '=', 'searchTerms.id');
    return searches;
  } catch (error) {
    return error.message;
  }
};

// Get topics by Category
const getSearchesByQuote = async (quote) => {
  try {
    const searches = await knex('searches')
      .select('searches.*')
      .join('searchesQuotes', 'searchesQuotes.search_id', '=', 'searches.id')
      .join('quotes', 'searchesQuotes.quote_id', '=', 'quotes.id')
      .where({ quote_id: quote });
    return searches;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getSearches,
  getSearchesByQuote,
};
