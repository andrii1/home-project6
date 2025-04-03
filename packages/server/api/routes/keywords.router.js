/* TODO: This is just an example file to illustrate API routing and
documentation. Can be deleted when the first real route is added. */

const express = require('express');

const router = express.Router({ mergeParams: true });

// controllers
const keywordsController = require('../controllers/keywords.controller');

router.get('/', (req, res, next) => {
  if (req.query.quote) {
    keywordsController
      .getKeywordsByQuote(req.query.quote)
      .then((result) => res.json(result))
      .catch(next);
  } else {
    try {
      keywordsController
        .getKeywords()
        .then((result) => res.json(result))
        .catch(next);
    } catch (error) {
      res.status(404).json({ error: 'Bad Get Request' });
    }
  }
});

module.exports = router;
