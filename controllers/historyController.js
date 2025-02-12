// controllers/historyController.js
const ArticleHistory = require('../models/ArticleHistory');

/**
 * @swagger
 * tags:
 *   name: History
 *   description: Histórico de alterações dos artigos
 */

exports.basePath = '/history';

// Obtém o histórico de um artigo
exports.listByArticle = async (req, res) => {
  try {
    const histories = await ArticleHistory.find({ articleId: req.params.articleId });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtém detalhes de uma versão histórica
exports.getDetail = async (req, res) => {
  try {
    const history = await ArticleHistory.findById(req.params.historyId);
    if (!history) return res.status(404).json({ message: 'Histórico não encontrado' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  {
    method: 'get',
    route: '/:articleId',
    handler: exports.listByArticle,
  },
  {
    method: 'get',
    route: '/detail/:historyId',
    handler: exports.getDetail,
  },
];
