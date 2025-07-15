/* TODO: This is an example controller to illustrate a server side controller.
Can be deleted as soon as the first real controller is added. */

const knex = require('../../config/db');
const HttpError = require('../lib/utils/http-error');
const OpenAI = require('openai');
const generateSlug = require('../lib/utils/generateSlug');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // make sure this is set in your .env
});

const getOppositeOrderDirection = (direction) => {
  let lastItemDirection;
  if (direction === 'asc') {
    lastItemDirection = 'desc';
  } else if (direction === 'desc') {
    lastItemDirection = 'asc';
  }
  return lastItemDirection;
};

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
  const existing = await knex('tags').where({ slug }).first();
  return !!existing;
}

const getQuotesAll = async () => {
  try {
    const quotes = knex('quotes')
      .select(
        'quotes.*',
        'authors.full_name as authorFullName',
        'authors.id as authorId',
      )
      .join('authors', 'quotes.author_id', '=', 'authors.id');

    return quotes;
  } catch (error) {
    return error.message;
  }
};

const getQuotesRandom = async () => {
  try {
    const quotes = knex('quotes')
      .select(
        'quotes.*',
        'authors.full_name as authorFullName',
        'authors.id as authorId',
      )
      .join('authors', 'quotes.author_id', '=', 'authors.id')
      .orderByRaw('RAND()')
      .first(); // Get a single random result

    return quotes;
  } catch (error) {
    return error.message;
  }
};

const getDayQuote = async () => {
  try {
    const [{ count }] = await knex('quotes').count('id as count');
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Convert date to a hashable number
    const dateHash = today.split('-').join(''); // '20250712'
    const index = parseInt(dateHash, 10) % count;

    const quote = await knex('quotes')
      .select(
        'quotes.*',
        'authors.full_name as authorFullName',
        'authors.id as authorId',
      )
      .join('authors', 'quotes.author_id', '=', 'authors.id')
      .limit(1)
      .offset(index); // Skip to the calculated index

    return quote[0];
  } catch (error) {
    return { error: error.message };
  }
};

const getQuotes = async (page, column, direction) => {
  const lastItemDirection = getOppositeOrderDirection(direction);
  try {
    const getModel = () =>
      knex('quotes')
        .select(
          'quotes.*',
          'authors.full_name as authorFullName',
          'authors.id as authorId',
        )
        .join('authors', 'quotes.author_id', '=', 'authors.id');
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
          'authors.id as authorId',
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
          'authors.id as authorId',
          'tags.id as tagId',
          'tags.slug as tagSlug',
          'tags.title as tagTitle',
        )
        .join('authors', 'quotes.author_id', '=', 'authors.id')
        .join('tagsQuotes', 'tagsQuotes.quote_id', '=', 'quotes.id')
        .join('tags', 'tags.id', '=', 'tagsQuotes.tag_id')
        .where('tags.slug', '=', `${tag}`);
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
  search,
}) => {
  const lastItemDirection = getOppositeOrderDirection(direction);
  try {
    const getModel = () =>
      knex('quotes')
        .select(
          'quotes.*',
          'authors.full_name as authorFullName',
          'authors.id as authorId',
        )
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
          if (search !== undefined) {
            queryBuilder.where('quotes.title', 'like', `%${search}%`);
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
      .select(
        'quotes.*',
        'authors.full_name as authorFullName',
        'authors.id as authorId',
        'authors.description as authorDescription',
      )
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
const createQuote = async (token, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    // Optional: check for existing author
    const existing = await knex('quotes')
      .whereRaw('LOWER(title) = ?', [body.title.toLowerCase()])
      .first();

    if (existing) {
      return {
        successful: true,
        existing: true,
        quoteId: existing.id,
      };
    }

    // Generate a short description using OpenAI
    // const prompt = `Create a tag for this quote: "${body.title}". Tag should be without hashtag, ideally one word, which describes the quote, but can be from more words if needed in context.`;

    const prompt = `Create 3-4 tags for this quote: "${body.title}". Tag should be without hashtag, ideally one word, which describes the quote, but can be from more words if needed in context. Return tags separated by comma.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const tagsString = completion.choices[0].message.content.trim();

    const tagsArray = tagsString.split(',').map((tag) => tag.trim());

    if (body.tag) {
      tagsArray.push(body.tag);
    }

    const tagIds = await Promise.all(
      tagsArray.map(async (tag) => {
        const existingTag = await knex('tags')
          .whereRaw('LOWER(title) = ?', [tag.toLowerCase()])
          .first();

        if (existingTag) {
          return existingTag.id;
        }
        const baseSlug = generateSlug(tag);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);
        const [tagId] = await knex('tags').insert({
          title: tag,
          slug: uniqueSlug,
        }); // just use the ID
        return tagId;
      }),
    );

    // const tag = completion.choices[0].message.content.trim();

    // const existingTag = await knex('tags')
    //   .whereRaw('LOWER(title) = ?', [tag.toLowerCase()])
    //   .first();

    // let tagId;

    // if (existingTag) {
    //   tagId = existingTag.id;
    // } else {
    //   const [newTag] = await knex('tags').insert({
    //     title: tag,
    //   });
    //   tagId = newTag;
    // }

    // Generate a short description using OpenAI
    const promptAiSummary = `Create a short explanation or emotional analysis of this quote: ${body.title}`;

    const completionAiSummary = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: promptAiSummary }],
      temperature: 0.7,
      max_tokens: 600,
    });

    const aiSummary = completionAiSummary.choices[0].message.content.trim();

    const [quoteId] = await knex('quotes').insert({
      title: body.title,
      description: body.description,
      url: body.url,
      image_url: body.image_url,
      meta_description: body.meta_description,
      ai_summary: aiSummary,
      author_id: body.author_id,
      user_id: body.user_id,
    });

    // const [insertedQuoteToTag] = await knex('tagsQuotes').insert({
    //   quote_id: quoteId,
    //   tag_id: tagId,
    // });

    const insertedQuoteToTags = await Promise.all(
      tagIds.map((tagId) =>
        knex('tagsQuotes').insert({
          quote_id: quoteId,
          tag_id: tagId,
        }),
      ),
    );

    return {
      successful: true,
      quoteId,
      insertedQuoteToTags,
    };
  } catch (error) {
    return error.message;
  }
};

// add quotes to tag
const addQuoteToTag = async (token, body, tag) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    await knex('tagsQuotes').insert({
      quote_id: body.quote_id,
      tag_id: tag,
    });

    return {
      successful: true,
    };
  } catch (error) {
    return error.message;
  }
};

// edit
const editQuote = async (token, updatedQuoteId, body) => {
  try {
    const userUid = token.split(' ')[1];
    const user = (await knex('users').where({ uid: userUid }))[0];
    if (!user) {
      throw new HttpError('User not found', 401);
    }

    if (!updatedQuoteId) {
      throw new HttpError('updatedQuoteId should be a number', 400);
    }

    return knex('quotes').where({ id: updatedQuoteId }).update({
      image_url: body.image_url,
    });
  } catch (error) {
    return error.message;
  }
};

module.exports = {
  getQuotes,
  getQuotesRandom,
  getDayQuote,
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
  createQuote,
  addQuoteToTag,
  editQuote,
};
