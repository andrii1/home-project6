/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const { shouldUseFlatConfig } = require('eslint/use-at-your-own-risk');
const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');
const moment = require('moment-timezone');

const getBlogs = async () => {
  try {
    const blogs = knex('blogs')
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

const getBlogById = async (id) => {
  if (!id) {
    throw new HttpError('Id should be a number', 400);
  }

  try {
    const exampleResources = await knex('blogs').where({ id });
    if (exampleResources.length === 0) {
      throw new Error(`incorrect entry with the id of ${id}`, 404);
    }
    return exampleResources;
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
    await knex('blogs').insert({
      title: body.title,
      content: body.content,
      slug: body.slug,
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
  getBlogById,
  // deleteExampleResource,
  createBlog,
  // editExampleResource,
};
