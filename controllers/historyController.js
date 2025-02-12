// controllers/historyController.js
const ArticleHistory = require('../models/ArticleHistory');

/**
 * @swagger
 * tags:
 *   name: History
 *   description: Histórico de alterações dos artigos
 */
exports.basePath = '/history';

/**
 * @swagger
 * /history/{articleId}:
 *   get:
 *     summary: Obtém o histórico de alterações de um artigo
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de históricos do artigo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ArticleHistory'
 *       500:
 *         description: Erro interno no servidor
 */
exports.listByArticle = async (req, res) => {
  try {
    const histories = await ArticleHistory.find({ articleId: req.params.articleId });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /history/detail/{historyId}:
 *   get:
 *     summary: Obtém detalhes de uma versão histórica de um artigo
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: historyId
 *         required: true
 *         description: ID da versão histórica
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes da versão histórica do artigo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ArticleHistory'
 *       404:
 *         description: Histórico não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
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
  { method: 'get', route: '/:articleId', handler: exports.listByArticle },
  { method: 'get', route: '/detail/:historyId', handler: exports.getDetail },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     ArticleHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890ghi"
 *         articleId:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890abc"
 *         title:
 *           type: string
 *           example: "Título do artigo antigo"
 *         content:
 *           type: string
 *           example: "Conteúdo antigo do artigo"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-02-12T12:00:00Z"
 */
