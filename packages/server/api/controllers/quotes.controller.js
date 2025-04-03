/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');

const getOppositeOrderDirection = (direction) => {
  let lastItemDirection;
  if (direction === 'asc') {
    lastItemDirection = 'desc';
  } else if (direction === 'desc') {
    lastItemDirection = 'asc';
  }
  return lastItemDirection;
};

const getQuotesAll = async () => {
  try {
    const quotes = knex('quotes')
      .select('apps.*', 'authors.full_name as authorFullName')
      .join('authors', 'quotes.author_id', '=', 'authors.id');

    return quotes;
  } catch (error) {
    return error.message;
  }
};

const getQuotes = async (page, column, direction) => {
  const lastItemDirection = getOppositeOrderDirection(direction);
  try {
    const getModel = () =>
      knex('quotes')
        .select('quotes.*', 'authors.full_name as authorFullName')
        .join('topics', 'quotes.author_id', '=', 'authors.id');
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

// const getAppsPagination = async (column, direction, page, size) => {
//   try {
//     const getModel = () =>
//       knex('apps')
//         .select(
//           'apps.*',
//           'topics.title as topicTitle',
//           'topics.category_id as category_id',
//           'categories.title as categoryTitle',
//         )
//         .join('topics', 'apps.topic_id', '=', 'topics.id')
//         .join('categories', 'topics.category_id', '=', 'categories.id')
//         .orderBy(column, direction);
//     const totalCount = await getModel()
//       .count('apps.id', { as: 'rows' })
//       .groupBy('apps.id');
//     const data = await getModel()
//       .offset(page * size)
//       .limit(size)
//       .select();
//     const dataExport = await getModel().select();

//     return {
//       totalCount: totalCount.length,
//       data,
//       dataExport,
//     };
//   } catch (error) {
//     return error.message;
//   }
// };

// const getAppsSearch = async (search, column, direction, page, size) => {
//   try {
//     const getModel = () =>
//       knex('apps')
//         .select(
//           'apps.*',
//           'topics.title as topicTitle',
//           'topics.category_id as category_id',
//           'categories.title as categoryTitle',
//         )
//         .join('topics', 'apps.topic_id', '=', 'topics.id')
//         .join('categories', 'topics.category_id', '=', 'categories.id')
//         .orderBy(column, direction)
//         .where('apps.title', 'like', `%${search}%`);
//     const totalCount = await getModel()
//       .count('apps.id', { as: 'rows' })
//       .groupBy('apps.id');
//     const data = await getModel()
//       .offset(page * size)
//       .limit(size)
//       .select();
//     const dataExport = await getModel().select();

//     return {
//       totalCount: totalCount.length,
//       data,
//       dataExport,
//     };
//   } catch (error) {
//     return error.message;
//   }
// };

// const getAppsByCategoriesSearch = async (
//   search,
//   categories,
//   column,
//   direction,
//   page,
//   size,
// ) => {
//   try {
//     const getModel = () =>
//       knex('apps')
//         .select(
//           'apps.*',
//           'topics.title as topicTitle',
//           'topics.category_id as category_id',
//           'categories.title as categoryTitle',
//         )
//         .join('topics', 'apps.topic_id', '=', 'topics.id')
//         .join('categories', 'topics.category_id', '=', 'categories.id')
//         .whereIn('category_id', categories)
//         .where('apps.title', 'like', `%${search}%`)
//         .orderBy(column, direction);
//     const totalCount = await getModel()
//       .count('apps.id', { as: 'rows' })
//       .groupBy('apps.id');
//     const data = await getModel()
//       .offset(page * size)
//       .limit(size)
//       .select();
//     const dataExport = await getModel().select();
//     return {
//       totalCount: totalCount.length,
//       data,
//       dataExport,
//     };
//   } catch (error) {
//     return error.message;
//   }
// };

// const getAppsByCategories = async (categories) => {
//   try {
//     const apps = await knex('apps')
//       .select(
//         'apps.*',
//         'topics.title as topicTitle',
//         'topics.category_id as category_id',
//         'categories.title as categoryTitle',
//       )
//       .join('topics', 'apps.topic_id', '=', 'topics.id')
//       .join('categories', 'topics.category_id', '=', 'categories.id')
//       .whereIn('category_id', categories);

//     return apps;
//   } catch (error) {
//     return error.message;
//   }
// };

// const getAppsByTopicsSearch = async (
//   search,
//   topics,
//   column,
//   direction,
//   page,
//   size,
// ) => {
//   try {
//     const getModel = () =>
//       knex('apps')
//         .select(
//           'apps.*',
//           'topics.title as topicTitle',
//           'topics.category_id as category_id',
//           'categories.title as categoryTitle',
//         )
//         .join('topics', 'apps.topic_id', '=', 'topics.id')
//         .join('categories', 'topics.category_id', '=', 'categories.id')
//         .whereIn('topic_id', topics)
//         .where('apps.title', 'like', `%${search}%`)
//         .orderBy(column, direction);
//     const totalCount = await getModel()
//       .count('apps.id', { as: 'rows' })
//       .groupBy('apps.id');
//     const data = await getModel()
//       .offset(page * size)
//       .limit(size)
//       .select();
//     const dataExport = await getModel().select();
//     return {
//       totalCount: totalCount.length,
//       data,
//       dataExport,
//     };
//   } catch (error) {
//     return error.message;
//   }
// };

// const getAppsByTopics = async (topics) => {
//   try {
//     const apps = await knex('apps')
//       .select(
//         'apps.*',
//         'topics.title as topicTitle',
//         'topics.category_id as category_id',
//         'categories.title as categoryTitle',
//       )
//       .join('topics', 'apps.topic_id', '=', 'topics.id')
//       .join('categories', 'topics.category_id', '=', 'categories.id')
//       .whereIn('topic_id', topics)
//       .orderBy('id', 'asc');
//     return apps;
//   } catch (error) {
//     return error.message;
//   }
// };

// const getAppsByCategory = async (category, page, column, direction) => {
//   const lastItemDirection = getOppositeOrderDirection(direction);
//   try {
//     const getModel = () =>
//       knex('apps')
//         .select(
//           'apps.*',
//           'topics.title as topicTitle',
//           'topics.category_id as category_id',
//           'categories.title as categoryTitle',
//         )
//         .join('topics', 'apps.topic_id', '=', 'topics.id')
//         .join('categories', 'topics.category_id', '=', 'categories.id')
//         .where({
//           'topics.category_id': category,
//         });

//     const lastItem = await getModel()
//       .orderBy(column, lastItemDirection)
//       .limit(1);
//     const data = await getModel()
//       .orderBy(column, direction)
//       .offset(page * 10)
//       .limit(10)
//       .select();
//     return {
//       lastItem: lastItem[0],
//       data,
//     };
//   } catch (error) {
//     return error.message;
//   }
// };

// const getAppsByTopic = async (topic, page, column, direction) => {
//   const lastItemDirection = getOppositeOrderDirection(direction);
//   try {
//     const getModel = () =>
//       knex('apps')
//         .select(
//           'apps.*',
//           'topics.title as topicTitle',
//           'topics.category_id as category_id',
//           'categories.title as categoryTitle',
//         )
//         .join('topics', 'apps.topic_id', '=', 'topics.id')
//         .join('categories', 'topics.category_id', '=', 'categories.id')
//         .where({ topic_id: topic });
//     const lastItem = await getModel()
//       .orderBy(column, lastItemDirection)
//       .limit(1);
//     const data = await getModel()
//       .orderBy(column, direction)
//       .offset(page * 10)
//       .limit(10)
//       .select();
//     return {
//       lastItem: lastItem[0],
//       data,
//     };
//   } catch (error) {
//     return error.message;
//   }
// };

const getQuotesBySearchTerm = async (page, column, direction, searchTerm) => {
  const lastItemDirection = getOppositeOrderDirection(direction);
  try {
    const getModel = () =>
      knex('quotes')
        .select(
          'quotes.*',
          'authors.full_name as authorFullName',
          'searches.id as searchId',
          'searches.title as searchTitle',
        )
        .join('authors', 'quotes.author_id', '=', 'authors.id')
        .join('searchesQuotes', 'searchesQuotes.deal_id', '=', 'quotes.id')
        .join('searches', 'searches.id', '=', 'searchesQuotes.search_id')
        .where('searches.id', '=', `${searchTerm}`);
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

const getQuotesByTag = async (page, column, direction, tag) => {
  const lastItemDirection = getOppositeOrderDirection(direction);
  try {
    const getModel = () =>
      knex('quotes')
        .select(
          'quotes.*',
          'authors.full_name as authorFullName',
          'tags.id as tagId',
          'tags.title as tagTitle',
        )
        .join('authors', 'quotes.author_id', '=', 'authors.id')
        .join('tagsQuotes', 'tagsQuotes.quote_id', '=', 'quotes.id')
        .join('tags', 'tags.id', '=', 'tagsQuotes.tag_id')
        .where('tags.id', '=', `${tag}`);
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

const getQuotesBy = async ({
  page,
  column,
  direction,
  filteredAuthors,
  filteredCategories,
  filteredPricing,
  filteredDetails,
}) => {
  const lastItemDirection = getOppositeOrderDirection(direction);
  try {
    const getModel = () =>
      knex('quotes')
        .select('quotes.*', 'authors.full_name as authorFullName')
        .join('authors', 'quotes.author_id', '=', 'authors.id')
        .modify((queryBuilder) => {
          if (filteredAuthors !== undefined) {
            queryBuilder.where('author_id', filteredAuthors);
          }
          if (filteredCategories !== undefined) {
            queryBuilder.where('topics.category_id', filteredCategories);
          }
          if (filteredPricing !== undefined) {
            queryBuilder.whereIn('apps.pricing_type', filteredPricing);
          }
          if (
            filteredDetails !== undefined &&
            filteredDetails.includes('Browser extension')
          ) {
            queryBuilder.whereNotNull('apps.url_chrome_extension');
          }
          if (
            filteredDetails !== undefined &&
            filteredDetails.includes('iOS app available')
          ) {
            queryBuilder.whereNotNull('apps.url_app_store');
          }
          if (
            filteredDetails !== undefined &&
            filteredDetails.includes('Android app available')
          ) {
            queryBuilder.whereNotNull('apps.url_google_play_store');
          }

          if (
            filteredDetails !== undefined &&
            filteredDetails.includes('Social media contacts')
          ) {
            queryBuilder
              .whereNotNull('apps.url_x')
              .orWhereNotNull('apps.url_discord');
          }
        });
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

// Get apps by id
const getQuoteById = async (id) => {
  if (!id) {
    throw new HttpError('Id should be a number', 400);
  }
  try {
    const app = await knex('quotes')
      .select('quotes.*', 'authors.full_name as authorFullName')
      .join('authors', 'quotes.author_id', '=', 'authors.id')
      .where({ 'quotes.id': id });
    if (app.length === 0) {
      throw new HttpError(`incorrect entry with the id of ${id}`, 404);
    }
    return app;
  } catch (error) {
    return error.message;
  }
};

// post
// const createApps = async (token, body) => {
//   try {
//     const userUid = token.split(' ')[1];
//     const user = (await knex('users').where({ uid: userUid }))[0];
//     if (!user) {
//       throw new HttpError('User not found', 401);
//     }
//     await knex('apps').insert({
//       title: body.title,
//       description: body.description,
//       topic_id: body.topic_id,
//       user_id: user.id,
//     });
//     return {
//       successful: true,
//     };
//   } catch (error) {
//     return error.message;
//   }
// };

module.exports = {
  getQuotes,
  // getQuotesPagination,
  // getAppsSearch,
  // getAppsByCategories,
  // getAppsByCategoriesSearch,
  // getAppsByTopics,
  // getAppsByTopic,
  getQuotesByTag,
  getQuotesBySearchTerm,
  getQuotesBy,
  // getAppsByTopicsSearch,
  // getAppsByCategory,
  getQuoteById,
  getQuotesAll,
  // createApps,
};
