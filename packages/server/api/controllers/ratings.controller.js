const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

const getAllRatings = async () => {
  try {
    const ratings = await knex('ratings');

    return ratings;
  } catch (error) {
    return error.message;
  }
};
// get by user-id
const getRatingsByUserId = async (token) => {
  const userUid = token.split(' ')[1];
  const user = (await knex('users').where({ uid: userUid }))[0];

  if (!token) {
    throw new HttpError('There are not users', 401);
  }

  try {
    const ratings = await knex('quotes')
      .select('quotes.*', 'ratings.id as ratingsID')
      .leftJoin('ratings', function () {
        this.on('quotes.id', '=', 'ratings.quote_id');
      })
      .where('ratings.user_id', '=', `${user.id}`);

    if (ratings.length === 0) {
      throw new HttpError(`There are no ratings available with this user`, 404);
    }

    return ratings;
  } catch (error) {
    return error.message;
  }
};

// get by user-id and quote-id
const getRatingsByQuoteId = async (token, quoteId) => {
  const userUid = token.split(' ')[1];
  const user = (await knex('users').where({ uid: userUid }))[0];

  if (!token) {
    throw new HttpError('There are not users', 401);
  }

  try {
    const ratings = await knex('quotes')
      .select('quotes.*', 'ratings.id as ratingsID')
      .leftJoin('ratings', function () {
        this.on('quotes.id', '=', 'ratings.quote_id');
      })
      .where('ratings.user_id', '=', `${user.id}`)
      .where('ratings.quote_id', '=', `${quoteId}`);

    if (ratings.length === 0) {
      throw new HttpError(
        `There are no ratings available with this user for this quote`,
        404,
      );
    }

    return ratings;
  } catch (error) {
    return error.message;
  }
};

// post
const createratings = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }
    await knex('ratings').insert({
      user_id: user.id,
      quote_id: body.quote_id,
    });
    return {
      successful: true,
    };
  } catch (error) {
    return error.message;
  }
};

// delete

const deleteratings = async (token, ratingsId) => {
  const userUid = token.split(' ')[1];
  const user = (await knex('users').where({ uid: userUid }))[0];
  if (!user) {
    throw new HttpError('User not found', 401);
  }
  try {
    const deletedFav = await knex('ratings')
      .where({ quote_id: ratingsId, user_id: user.id })
      .del();
    if (deletedFav === 0) {
      throw new HttpError('The ratings ID you provided does not exist.', 400);
    } else {
      return {
        successful: true,
      };
    }
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getRatingsByUserId,
  getRatingsByQuoteId,
  createratings,
  deleteratings,
  getAllRatings,
};
