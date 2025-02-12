// controllers/statsController.js
const Article = require('../models/Article');
const User = require('../models/User');

/**
 * @swagger
 * tags:
 *   name: Stats
 *   description: Estatísticas e relatórios da Wiki
 */
exports.basePath = '/stats';

/**
 * @swagger
 * /stats/usage:
 *   get:
 *     summary: Retorna estatísticas gerais de uso da Wiki
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Estatísticas de uso retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalArticles:
 *                   type: number
 *                   example: 50
 *                 totalUsers:
 *                   type: number
 *                   example: 20
 *       500:
 *         description: Erro interno no servidor
 */
exports.usageStats = async (req, res) => {
  try {
    const totalArticles = await Article.countDocuments();
    const totalUsers = await User.countDocuments();
    res.json({ totalArticles, totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /stats/user-activity:
 *   get:
 *     summary: Retorna a atividade dos usuários (quantidade de artigos criados/atualizados)
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Atividade dos usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID do usuário
 *                     example: "63f9c2f8e3b0a34567890abc"
 *                   count:
 *                     type: number
 *                     description: Número de artigos criados/atualizados pelo usuário
 *                     example: 5
 *       500:
 *         description: Erro interno no servidor
 */
exports.userActivity = async (req, res) => {
  try {
    // Exemplo simples: lista usuários com contagem de artigos
    const activity = await Article.aggregate([
      { $group: { _id: "$userId", count: { $sum: 1 } } }
    ]);
    res.json(activity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /stats/export:
 *   get:
 *     summary: Exporta os dados da Wiki (por exemplo, retorna todos os artigos com detalhes)
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Dados exportados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Erro interno no servidor
 */
exports.exportData = async (req, res) => {
  try {
    const articles = await Article.find().populate('section tags');
    res.json(articles); // Em um cenário real, você pode gerar um CSV ou outro formato
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  { method: 'get', route: '/usage', handler: exports.usageStats },
  { method: 'get', route: '/user-activity', handler: exports.userActivity },
  { method: 'get', route: '/export', handler: exports.exportData },
  // Os endpoints top-articles e recent-changes já podem ser implementados conforme necessário

  
];
