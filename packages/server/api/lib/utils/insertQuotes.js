/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
/* eslint-disable no-return-await */

const fetch = require('node-fetch');
require('dotenv').config();

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

async function fetchExistingTags() {
  const res = await fetch(`${API_PATH}/tags`);
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

async function insertTag(title) {
  const res = await fetch(`${API_PATH}/tags`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  return await res.json(); // assume it returns { id, full_name }
}

async function insertQuoteToTag(quoteObj, tag) {
  const res = await fetch(`${API_PATH}/quotes?tag=${tag}`, {
    method: 'POST',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
  });
  return await res.json(); // assume it returns { id, title }
}

async function updateQuote(quoteId, quoteObj) {
  const res = await fetch(`${API_PATH}/quotes/${quoteId}`, {
    method: 'PATCH',
    headers: {
      token: `token ${USER_UID}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteObj),
  });
  if (!res.ok) {
    const errorBody = await res.text(); // <- read text, not json
    console.error(`Failed to update quote (${res.status}):`, errorBody);
    throw new Error(`Failed to update quote: ${res.statusText}`);
  }
  console.log('Updated quote:', quoteObj);
  return await res.json();
}

// Function to get the quote and author
function getQuoteAndAuthor(quote) {
  const match = quote.match(/^(.*?)[\s"”]?[–-]\s*([\w\s.]+)$/);
  if (match) {
    return { text: match[1].trim(), author: match[2].trim() };
  }
  return { text: quote.trim(), author: 'Unknown' };
}

const insertQuotes = async (quotesParam) => {
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

  // const quotes = await createQuotesChatGpt();
  console.log('quotes', quotesParam);
  for (const quote of quotesParam) {
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

    // Get or insert tag
    // let tagId;
    // let tagTitle;
    // if (tag) {
    //   const normalizedTag = tag.toLowerCase().trim();

    //   if (tagMap.has(normalizedTag)) {
    //     const tagData = tagMap.get(normalizedTag);
    //     tagId = tagData.id;
    //     tagTitle = tagData.title;
    //   } else {
    //     const newTag = await insertTag(tag);
    //     tagId = newTag.tagId;
    //     tagTitle = newTag.tagTitle;
    //     tagMap.set(normalizedTag, {
    //       id: tagId,
    //       title: tagTitle,
    //     });
    //   }
    // }

    // New quote
    console.log('Inserting quote:', text);
    const newQuote = await insertQuote({
      title: text,
      author_id: authorId,
      user_id: '1',
    });

    // Skip if quote exists
    if (newQuote.existing) {
      console.log('Duplicate quote skipped:', text);
      continue;
    }
    console.log('Inserted quote:', newQuote);

    // if (tag) {
    //   const newQuoteToTag = await insertQuoteToTag(
    //     {
    //       quote_id: newQuote.quoteId,
    //     },
    //     tagId
    //   );
    //   console.log("Inserted quoteToTag:", newQuoteToTag);
    // }
  }
};
module.exports = insertQuotes;
