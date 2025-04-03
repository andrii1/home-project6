/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');

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
  getTopicsByCategory,
};
