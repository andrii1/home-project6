/* TODO: This is just an example file to illustrate API routing and
documentation. Can be deleted when the first real route is added. */

const express = require('express');

const router = express.Router({ mergeParams: true });

const topicAppsRouter = require('./topicApps.router');

router.use('/topics/:topicId/apps', topicAppsRouter);

// controllers
const quotesController = require('../controllers/quotes.controller');

/**
 * @swagger
 * /exampleResource:
 *  get:
 *    tags:
 *    - exampleResource
 *    summary: Get all exampleResource
 *    description:
 *      Will return all exampleResource.
 *    produces: application/json
 *    responses:
 *      200:
 *        description: Successful request
 *      5XX:
 *        description: Unexpected error.
 */
router.get('/', (req, res, next) => {
  // if (req.query.filteredTopics && req.query.search) {
  //   const array = req.query.filteredTopics.split(',');
  //   quotesController
  //     .getAppsByTopicsSearch(
  //       req.query.search,
  //       array,
  //       req.query.column,
  //       req.query.direction,
  //       req.query.page,
  //       req.query.size,
  //     )
  //     .then((result) => res.json(result))
  //     .catch(next);
  // } else

  if (
    req.query.filteredAuthors ||
    req.query.filteredCategories ||
    req.query.filteredPricing ||
    req.query.filteredDetails ||
    req.query.search
  ) {
    let arrayPricing;
    let arrayDetails;
    if (req.query.filteredPricing !== undefined) {
      const decoded = decodeURIComponent(req.query.filteredPricing);
      arrayPricing = decoded.split(',');
    }
    if (req.query.filteredDetails !== undefined) {
      const decoded = decodeURIComponent(req.query.filteredDetails);
      arrayDetails = decoded.split(',');
    }
    // const array = req.query.filteredTopics.split(',');
    quotesController
      .getQuotesBy({
        page: req.query.page,
        column: req.query.column,
        direction: req.query.direction,
        filteredAuthors: req.query.filteredAuthors,
        filteredCategories: req.query.filteredCategories,
        filteredPricing: arrayPricing,
        filteredDetails: arrayDetails,
        search: req.query.search,
      })
      .then((result) => res.json(result))
      .catch(next);
  }
  // else if (req.query.filteredCategories) {
  //   const array = req.query.filteredCategories.split(',');
  //   appsController
  //     .getAppsByCategory(
  //       req.query.filteredCategories,
  //       req.query.page,
  //       req.query.column,
  //       req.query.direction,
  //     )
  //     .then((result) => res.json(result))
  //     .catch(next);
  // } else if (req.query.search) {
  //   appsController
  //     .getAppsSearch(
  //       req.query.search,
  //       req.query.column,
  //       req.query.direction,
  //       req.query.page,
  //       req.query.size,
  //     )
  //     .then((result) => res.json(result))
  //     .catch(next);
  // }
  else if (req.query.searchTerm) {
    quotesController
      .getQuotesBySearchTerm(
        req.query.page,
        req.query.column,
        req.query.direction,
        req.query.searchTerm,
      )
      .then((result) => res.json(result))
      .catch(next);
  } else if (req.query.tag) {
    quotesController
      .getQuotesByTag(
        req.query.page,
        req.query.column,
        req.query.direction,
        req.query.tag,
      )
      .then((result) => res.json(result))
      .catch(next);
  } else if (req.query.page) {
    quotesController
      .getQuotes(req.query.page, req.query.column, req.query.direction)
      .then((result) => res.json(result))
      .catch(next);
  } else {
    quotesController
      .getQuotesAll()
      .then((result) => res.json(result))
      .catch(next);
  }
});

router.get('/random', (req, res, next) => {
  quotesController
    .getQuotesRandom()
    .then((result) => res.json(result))
    .catch(next);
});

router.get('/day-quote', (req, res, next) => {
  quotesController
    .getDayQuote()
    .then((result) => res.json(result))
    .catch(next);
});

/* Create Quotes */

router.post('/', (req, res, next) => {
  const { token } = req.headers;
  if (req.query.tag) {
    quotesController
      .addQuoteToTag(token, req.body, req.query.tag)
      .then((result) => res.json(result))
      .catch(next);
  } else {
    quotesController
      .createQuote(token, req.body)
      .then((result) => res.json(result))
      .catch(next);
  }
});

router.patch('/:id', (req, res, next) => {
  const { token } = req.headers;
  quotesController
    .editQuote(token, req.params.id, req.body)
    .then((result) => res.json(result))
    .catch(next);
});

/**
 * @swagger
 * /exampleResources/{ID}:
 *  get:
 *    tags:
 *    - ExampleResources
 *    summary: Get exampleResource by ID
 *    description:
 *      Will return single exampleResource with a matching ID.
 *    produces: application/json
 *    parameters:
 *     - in: path
 *       name: ID
 *       schema:
 *         type: integer
 *         required: true
 *         description: The ID of the exampleResource to get
 *
 *    responses:
 *      200:
 *        description: Successful request
 *      5XX:
 *        description: Unexpected error.
 */

router.get('/:id', (req, res, next) => {
  quotesController
    .getQuoteById(req.params.id)
    .then((result) => res.json(result))
    .catch(next);
});

module.exports = router;
