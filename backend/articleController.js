const NewsAPI = require('newsapi');
const Article = require('./article');

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

exports.saveArticles = async (req, res) => {
  try {
    const response = await newsapi.v2.everything({
      q: 'web3',
      language: 'en',
      pageSize: 20
    });

    const articles = response.articles;

    const formattedArticles = articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      upvotes: 0,
      downvotes: 0,
    }));

    await Article.insertMany(formattedArticles);

    res.json({ message: 'Articles saved successfully', articles: formattedArticles });
  } catch (error) {
    console.error('Error fetching or saving news:', error);
    res.status(500).json({ error: 'Failed to fetch and save articles', details: error.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({});
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles from database:', error);
    res.status(500).json({ error: 'Failed to fetch articles from database', details: error.message });
  }
};

exports.voteArticle = async (req, res) => {
  const { articleId, voteType } = req.body;

  try {
    const article = await Article.findById(articleId);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (voteType === 'up') {
      article.upvotes += 1;
    } else if (voteType === 'down') {
      article.downvotes += 1;
    } else {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    await article.save();

    res.json({ message: 'Vote recorded successfully', article });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: 'Failed to record vote', details: error.message });
  }
};
