// controllers/searchController.js
const Article = require('../models/Article');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Pesquisa avançada de artigos
 */
exports.basePath = '/search';

/**
 * @swagger
 * /search/advanced:
 *   get:
 *     summary: Realiza uma busca avançada de artigos por título, tag e datas
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: title
 *         description: Título ou parte do título para busca
 *         schema:
 *           type: string
 *       - in: query
 *         name: tag
 *         description: ID da tag para filtrar artigos
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateFrom
 *         description: Data inicial para filtrar artigos (formato ISO)
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: dateTo
 *         description: Data final para filtrar artigos (formato ISO)
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Lista de artigos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Erro interno no servidor
 */
exports.advancedSearch = async (req, res) => {
  try {
    const { title, tag, dateFrom, dateTo } = req.query;
    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (tag) {
      filter.tags = tag; // assume que 'tag' é o ID de uma tag
    }
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }
    const articles = await Article.find(filter);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  { method: 'get', route: '/advanced', handler: exports.advancedSearch },
  // O endpoint padrão GET /search já pode ser implementado para busca simples se desejado.
];
