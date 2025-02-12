// controllers/articlesController.js
const Article = require('../models/Article');
const ArticleHistory = require('../models/ArticleHistory');

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Gerencia os artigos da Wiki
 */

exports.basePath = '/articles';
exports.authCrud = true; // Criação, atualização e deleção requerem autenticação

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Lista todos os artigos
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Retorna uma lista de artigos
 */
exports.listAll = async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Adiciona um novo artigo
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               section:
 *                 type: string
 *     responses:
 *       201:
 *         description: Artigo criado com sucesso
 */
exports.create = async (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
      section: req.body.section,
      userId: req.user ? req.user.id : null,
    });
    const saved = await article.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Obtém os detalhes de um artigo
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do artigo
 *     responses:
 *       200:
 *         description: Detalhes do artigo
 */
exports.getById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Artigo não encontrado' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{id}:
 *   put:
 *     summary: Atualiza um artigo existente
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do artigo a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Artigo atualizado com sucesso
 */
exports.update = async (req, res) => {
  try {
    // Armazena a versão antiga antes de atualizar
    const oldArticle = await Article.findById(req.params.id);
    if (oldArticle) {
      const history = new ArticleHistory({
        articleId: oldArticle._id,
        title: oldArticle.title,
        content: oldArticle.content,
        updatedAt: new Date(),
      });
      await history.save();
    }

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        content: req.body.content,
        updatedAt: new Date(),
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Artigo não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Remove um artigo
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do artigo a ser removido
 *     responses:
 *       200:
 *         description: Artigo removido com sucesso
 */
exports.delete = async (req, res) => {
  try {
    const removed = await Article.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Artigo não encontrado' });
    res.json({ message: 'Artigo removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Endpoint customizado para restaurar uma versão antiga do artigo
 * POST /articles/{id}/restore/{historyId}
 */
exports.restoreVersion = async (req, res) => {
  try {
    const { id, historyId } = req.params;
    const history = await ArticleHistory.findById(historyId);
    if (!history) return res.status(404).json({ message: 'Histórico não encontrado' });

    const restored = await Article.findByIdAndUpdate(
      id,
      {
        title: history.title,
        content: history.content,
        updatedAt: new Date(),
      },
      { new: true }
    );
    res.json({ message: 'Artigo restaurado', article: restored });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Registra a rota customizada para restauração
exports.customRoutes = [
  {
    method: 'post',
    route: '/:id/restore/:historyId',
    auth: true,
    handler: exports.restoreVersion,
  },
];
