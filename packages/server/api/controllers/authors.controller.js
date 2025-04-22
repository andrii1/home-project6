/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');
// eslint-disable-next-line import/no-extraneous-dependencies
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

/* Get all authors */
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

const getAuthorById = async (id) => {
  if (!id) {
    throw new HttpError('Id should be a number', 400);
  }

  try {
    const authors = await knex('authors').where({ id });
    if (authors.length === 0) {
      throw new Error(`incorrect entry with the id of ${id}`, 404);
    }
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

    // Generate a short description using OpenAI
    const prompt = `Write a short, engaging 5-6 sentences bio, with markdown for markdown-to-jsx if needed, for an author named "${body.full_name}".`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const description = completion.choices[0].message.content.trim();

    const [authorId] = await knex('authors').insert({
      full_name: body.full_name,
      description,
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
// const getTopicsByCategory = async (category) => {
//   try {
//     const topics = await knex('topics').where({ category_id: category });
//     return topics;
//   } catch (error) {
//     return error.message;
//   }
// };

module.exports = {
  getAuthors,
  getAuthorById,
  createAuthor,
  //getTopicsByCategory,
};
