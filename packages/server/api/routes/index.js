const express = require('express');

if (typeof fetch === 'undefined') {
  global.fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
}

const router = express.Router();

const exampleResources = require('./exampleResources.router');
const quotes = require('./quotes.router');
const categories = require('./categories.router');
const authors = require('./authors.router');
const users = require('./users.router');
const favorites = require('./favorites.router');
const ratings = require('./ratings.router');
const stripe = require('./stripe.router');
const comments = require('./comments.router');
const cloudinary = require('./cloudinary.router');
const keywords = require('./keywords.router');
const searches = require('./searches.router');
const tags = require('./tags.router');
const blogs = require('./blogs.router');
const analytics = require('./analytics.router');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: '1.0',
      title: 'Final project',
      description: 'API documentation for the final project',
      contact: {},
    },
    host: '',
    basePath: '/api',
  },
  securityDefinitions: {},
  apis: ['./api/routes/*.js'],
};

const swaggerDocument = swaggerJsDoc(swaggerOptions);

// Route for Swagger API Documentation
router.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.use('/exampleResources', exampleResources);
router.use('/quotes', quotes);
router.use('/categories', categories);
router.use('/authors', authors);
router.use('/users', users);
router.use('/favorites', favorites);
router.use('/ratings', ratings);
router.use('/stripe', stripe);
router.use('/cloudinary', cloudinary);
router.use('/comments', comments);
router.use('/keywords', keywords);
router.use('/searches', searches);
router.use('/tags', tags);
router.use('/blogs', blogs);
router.use('/analytics', analytics);

module.exports = router;
