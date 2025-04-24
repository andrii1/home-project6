require('babel-register')({
  presets: ['es2015', 'react'],
});

// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');
const router = require('./sitemap-routes').default;
const Sitemap = require('react-router-sitemap').default;
// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

// eslint-disable-next-line prefer-destructuring
const REACT_APP_PROD_API_PATH = process.env.REACT_APP_PROD_API_PATH;

async function generateSitemap() {
  try {
    /* Quotes */
    const response = await fetch(`${REACT_APP_PROD_API_PATH}/quotes/`);
    const data = await response.json();
    const quotes = data.sort((a, b) => a.id - b.id);
    const idMap = [];

    /* Authors */
    const responseAuthors = await fetch(`${REACT_APP_PROD_API_PATH}/authors`);
    const dataAuthors = await responseAuthors.json();
    const authors = dataAuthors.sort((a, b) => a.id - b.id);
    const idMapAuthors = [];

    /* Tags */
    const responseTags = await fetch(`${REACT_APP_PROD_API_PATH}/tags`);
    const dataTags = await responseTags.json();
    const tags = dataTags.sort((a, b) => a.id - b.id);
    const idMapTags = [];

    /* Blogs */
    const responseBlogs = await fetch(`${REACT_APP_PROD_API_PATH}/blogs`);
    const dataBlogs = await responseBlogs.json();
    const blogs = dataBlogs.sort((a, b) => a.id - b.id);
    const idMapBlogs = [];

    quotes.forEach((quote) => {
      idMap.push({ id: quote.id });
    });

    authors.forEach((author) => {
      idMapAuthors.push({ authorIdParam: author.id });
    });

    tags.forEach((tag) => {
      idMapTags.push({ tagIdParam: tag.id });
    });

    blogs.forEach((blog) => {
      idMapBlogs.push({ slugParam: blog.slug });
    });

    const paramsConfig = {
      '/quotes/:id': idMap,
      '/quotes/author/:authorIdParam': idMapAuthors,
      '/quotes/tag/:tagIdParam': idMapTags,
      '/blog/:slugParam': idMapBlogs,
    };

    return new Sitemap(router)
      .applyParams(paramsConfig)
      .build('https://www.motivately.co')
      .save('./public/sitemap.xml');
  } catch (e) {
    console.log(e);
  }
}

generateSitemap();
