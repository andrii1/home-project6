/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const { shouldUseFlatConfig } = require('eslint/use-at-your-own-risk');
const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');
const generateSlug = require('../lib/utils/generateSlug');
const moment = require('moment-timezone');
const getOppositeOrderDirection = require('../lib/utils/getOppositeOrderDirection');
// eslint-disable-next-line no-unused-vars
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

// Helper: ensure the slug is unique by checking the DB
async function ensureUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let counter = 1;

  // eslint-disable-next-line no-await-in-loop
  while (await slugExists(slug)) {
    const suffix = `-${counter}`;
    const maxBaseLength = 200 - suffix.length;
    slug = `${baseSlug.slice(0, maxBaseLength)}${suffix}`;
    counter += 1;
  }

  return slug;
}

// Helper: check if a slug already exists in the database
async function slugExists(slug) {
  const existing = await knex('blogs').where({ slug }).first();
  return !!existing;
}

const getBlogs = async () => {
  try {
    const blogs = await knex('blogs')
      .select(
        'blogs.*',
        'users.email as userEmail',
        'users.full_name as userFullName',
      )
      .join('users', 'blogs.user_id', '=', 'users.id');

    return blogs;
  } catch (error) {
    return error.message;
  }
};

const getBlogsPagination = async (page, column, direction) => {
  const lastItemDirection = getOppositeOrderDirection(direction);
  try {
    const getModel = () => knex('blogs');
    const lastItem = await getModel()
      .orderBy(column, lastItemDirection)
      .limit(1);
    const data = await getModel()
      .orderBy(column, direction)
      .offset(page * 10)
      .limit(10)
      .select();
    return {
      lastItem: lastItem[0],
      data,
    };
  } catch (error) {
    return error.message;
  }
};

const getBlogById = async (slug) => {
  if (!slug) {
    throw new HttpError('Id should be a number', 400);
  }

  try {
    const blog = await knex('blogs')
      .select(
        'blogs.*',

        'users.full_name as userFullName',
      )
      .join('users', 'blogs.user_id', '=', 'users.id')
      .where({ slug });
    if (blog.length === 0) {
      throw new Error(`incorrect entry with the id of ${slug}`, 404);
    }
    return blog;
  } catch (error) {
    return error.message;
  }
};

// const editBlog = async (exampleResourceId, updatedExampleResource) => {
//   if (!exampleResourceId) {
//     throw new HttpError('exampleResourceId should be a number', 400);
//   }

//   return knex('blogs').where({ id: exampleResourceId }).update({
//     title: updatedExampleResource.title,
//     updatedAt: moment().format(),
//   });
// };

// const deleteExampleResource = async (exampleResourceId) => {
//   return knex('exampleResources').where({ id: exampleResourceId }).del();
// };

const createBlog = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    const baseSlug = generateSlug(body.title);
    const uniqueSlug = await ensureUniqueSlug(baseSlug);

    // Generate a short description using OpenAI
    const prompt = `Write a short, 200 characters maximum, blog summary for blog with title "${body.title}" and content "${body.content}".`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 100,
    });

    const summary = completion.choices[0].message.content.trim();

    await knex('blogs').insert({
      title: body.title,
      content: body.content,
      slug: uniqueSlug,
      summary,
      cover_image_url: body.cover_image_url,
      status: body.status,
      created_at: body.created_at,
      updated_at: body.updated_at,
      meta_description: body.meta_description,
      user_id: body.user_id,
    });

    return {
      successful: true,
    };
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getBlogs,
  getBlogsPagination,
  getBlogById,
  // deleteExampleResource,
  createBlog,
  // editExampleResource,
};
