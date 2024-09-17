const express = require('express');
const router = express.Router();
const articleController = require('./articleController');

router.get('/save', articleController.saveArticles);
router.get('/api/fetch', articleController.getArticles);
router.post('/api/vote', articleController.voteArticle);

module.exports = router;
