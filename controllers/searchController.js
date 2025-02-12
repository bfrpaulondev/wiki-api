// controllers/searchController.js
const Article = require('../models/Article');

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Pesquisa de artigos
 */

exports.basePath = '/search';

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Busca artigos por título ou conteúdo
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Termo de busca
 *     responses:
 *       200:
 *         description: Lista de artigos encontrados
 */
exports.search = async (req, res) => {
  try {
    const { q } = req.query;
    const articles = await Article.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  {
    method: 'get',
    route: '/',
    handler: exports.search,
  },
];
