/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

const createQuery = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    // Optional: check for existing tag
    const existing = await knex('queries')
      .whereRaw('LOWER(title) = ?', [body.title.toLowerCase()])
      .first();

    if (existing) {
      return {
        successful: true,
        existing: true,
        queryId: existing.id,
      };
    }

    const [queryId] = await knex('queries').insert({
      title: body.title.toLowerCase(),
    });

    return {
      successful: true,
      queryId,
      queryTitle: body.title,
    };
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  createQuery,
};
