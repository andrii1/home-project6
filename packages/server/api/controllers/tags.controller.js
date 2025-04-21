/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

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

const createTag = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    // Optional: check for existing author
    const existing = await knex('tags')
      .whereRaw('LOWER(title) = ?', [body.title.toLowerCase()])
      .first();

    if (existing) {
      return {
        successful: true,
        existing: true,
        tagId: existing.id,
      };
    }

    const [tagId] = await knex('tags').insert({
      title: body.title,
    });

    return {
      successful: true,
      tagId,
      tagTitle: body.title,
    };
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getTags,
  getTagsByQuote,
  createTag,
};
