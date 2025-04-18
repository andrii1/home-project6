/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

/* Get all topics */
const getAuthors = async () => {
  try {
    const authors = await knex('authors').select(
      'authors.id as id',
      'authors.full_name as fullName',
      'authors.description as description',
    );

    return authors;
  } catch (error) {
    return error.message;
  }
};

const createAuthor = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    // Optional: check for existing author
    const existing = await knex('authors')
      .whereRaw('LOWER(full_name) = ?', [body.full_name.toLowerCase()])
      .first();

    if (existing) {
      return {
        successful: true,
        existing: true,
        authorId: existing.id,
      };
    }

    const [authorId] = await knex('authors').insert({
      full_name: body.full_name,
    });

    return {
      successful: true,
      authorId,
      authorFullName: body.full_name,
    };
  } catch (error) {
    return error.message;
  }
};

// Get topics by Category
const getTopicsByCategory = async (category) => {
  try {
    const topics = await knex('topics').where({ category_id: category });
    return topics;
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  getTopicsByCategory,
};
