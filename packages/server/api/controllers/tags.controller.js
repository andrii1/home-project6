/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');

/* Get all topics */
const getTags = async () => {
  try {
    const tags = await knex('tags');
    return tags;
  } catch (error) {
    return error.message;
  }
};

// Get topics by Category
const getTagsByQuote = async (quote) => {
  try {
    const tags = await knex('tags')
      .select('tags.*')
      .join('tagsQuotes', 'tagsQuotes.tag_id', '=', 'tags.id')
      .join('quotes', 'tagsQuotes.quote_id', '=', 'quotes.id')
      .where({ quote_id: quote });
    return tags;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getTags,
  getTagsByQuote,
};
