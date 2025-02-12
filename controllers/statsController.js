// controllers/statsController.js
const Article = require('../models/Article');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Estatísticas e dashboard da Wiki
 */

exports.basePath = '/stats';

// Estatísticas gerais
exports.listGeneral = async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    res.json({ totalArticles });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Top artigos (exemplo baseado em um campo "views")
exports.topArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ views: -1 }).limit(5);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Últimas alterações
exports.recentChanges = async (req, res) => {
  try {
    const articles = await Article.find().sort({ updatedAt: -1 }).limit(5);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  {
    method: 'get',
    route: '/',
    handler: exports.listGeneral,
  },
  {
    method: 'get',
    route: '/top-articles',
    handler: exports.topArticles,
  },
  {
    method: 'get',
    route: '/recent-changes',
    handler: exports.recentChanges,
  },
];
