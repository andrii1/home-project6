/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
// const fetch = require("node-fetch");

require('dotenv').config();

const createQuotesChatGptBasedOnQuery = require('../serpApi/useChatGptApi.js');
const getSearchQueries = require('./useSearchConsoleApi.js');

// Credentials (from .env)
const USER_UID = process.env.USER_UID_MOT_PROD;
const API_PATH = process.env.API_PATH_MOT_PROD;

// fetch helpers
async function fetchExistingQuotes() {
  const res = await fetch(`${API_PATH}/quotes`);
  return res.json();
}

async function fetchExistingAuthors() {
  const res = await fetch(`${API_PATH}/authors`);
  return res.json();
}

async function insertAuthor(name) {
  const res = await fetch(`${API_PATH}/authors`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ full_name: name }),
  });
  return await res.json(); // assume it returns { id, full_name }
}

async function insertQuote(quoteObj) {
  const res = await fetch(`${API_PATH}/quotes`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
  });
  return await res.json(); // assume it returns { id, title }
}

async function insertQuery(queryObj) {
  const res = await fetch(`${API_PATH}/queries`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(queryObj),
  });
  return await res.json(); // assume it returns { id, title }
}

// Function to get the quote and author
function getQuoteAndAuthor(quote) {
  const match = quote.match(/^(.*?)[\s"”]?[–-]\s*([\w\s.]+)$/);
  if (match) {
    return { text: match[1].trim(), author: match[2].trim() };
  }
  return { text: quote.trim(), author: 'Unknown' };
}

function cleanUp(str) {
  return str
    .replace(/\bquotes?\b/gi, '') // remove "quote"/"quotes"
    .replace(/\s+/g, ' ') // collapse extra spaces
    .trim(); // remove leading/trailing space
}

const createQuotes = async () => {
  const existingQuotes = await fetchExistingQuotes();
  const existingAuthors = await fetchExistingAuthors();
  // const existingTags = await fetchExistingTags();

  const quoteMap = new Map(
    existingQuotes.map((q) => [q.title.toLowerCase().trim(), q.id]),
  );
  const authorMap = new Map(
    existingAuthors.map((a) => [
      a.fullName.toLowerCase().trim(),
      { id: a.id, fullName: a.fullName },
    ]),
  );
  const queries = await getSearchQueries();
  console.log('queries', queries);

  for (const query of queries) {
    const newQuery = await insertQuery({
      title: query,
    });

    if (newQuery.existing) {
      console.log('Duplicate query skipped:', query);
      continue;
    }
    const quotes = await createQuotesChatGptBasedOnQuery(query);

    console.log('quotes', quotes);

    const tag = cleanUp(query);

    for (const quote of quotes) {
      const { text, author } = getQuoteAndAuthor(quote);
      const wordCount = text.trim().split(/\s+/).length;

      // Skip if quote exists
      if (quoteMap.has(text.toLowerCase())) {
        console.log('Duplicate quote skipped:', text);
        continue;
      }

      if (wordCount > 38) {
        console.log('Too big quote skipped:', text);
        continue;
      }

      // Get or insert author
      let authorId;
      let authorFullName;
      const normalizedAuthor = author.toLowerCase().trim();

      if (authorMap.has(normalizedAuthor)) {
        const authorData = authorMap.get(normalizedAuthor);
        authorId = authorData.id;
        authorFullName = authorData.fullName;
      } else {
        const newAuthor = await insertAuthor(author);
        authorId = newAuthor.authorId;
        authorFullName = newAuthor.authorFullName;
        authorMap.set(normalizedAuthor, {
          id: authorId,
          fullName: authorFullName,
        });
      }

      // New quote
      console.log('Inserting quote:', text);
      const newQuote = await insertQuote({
        title: text,
        author_id: authorId,
        user_id: '1',
        tag,
      });

      // Skip if quote exists
      if (newQuote.existing) {
        console.log('Duplicate quote skipped:', text);
        continue;
      }
      console.log('Inserted quote:', newQuote);
    }
  }
};

createQuotes().catch(console.error);
