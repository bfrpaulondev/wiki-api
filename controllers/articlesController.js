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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
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
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       201:
 *         description: Artigo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 */
exports.create = async (req, res) => {
  try {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
      // Para compatibilidade, aceita 'section' ou 'sectionId'
      section: req.body.section || req.body.sectionId,
      userId: req.user ? req.user.id : null,
      // Novos campos adicionados:
      tags: req.body.tags || [],
      attachments: req.body.attachments || [],
      status: req.body.status || 'draft'
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
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalhes do artigo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Artigo não encontrado
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
 *         required: true
 *         description: ID do artigo a ser atualizado
 *         schema:
 *           type: string
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
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       200:
 *         description: Artigo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Artigo não encontrado
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
        // Atualiza também a seção, as tags, os attachments e o status
        section: req.body.section || req.body.sectionId,
        tags: req.body.tags,
        attachments: req.body.attachments,
        status: req.body.status,
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
 *         required: true
 *         description: ID do artigo a ser removido
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artigo removido com sucesso
 *       404:
 *         description: Artigo não encontrado
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
 * @swagger
 * /articles/{id}/restore/{historyId}:
 *   post:
 *     summary: Restaura uma versão antiga de um artigo
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *       - in: path
 *         name: historyId
 *         required: true
 *         description: ID do histórico a ser restaurado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artigo restaurado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Histórico ou artigo não encontrado
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

/**
 * @swagger
 * /articles/{id}/draft:
 *   post:
 *     summary: Salva um artigo como rascunho
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do artigo a ser salvo como rascunho
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artigo salvo como rascunho
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Artigo não encontrado
 */
exports.saveDraft = async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { status: 'draft', updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Artigo não encontrado' });
    res.json({ message: 'Artigo salvo como rascunho', article: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{id}/publish:
 *   put:
 *     summary: Publica um artigo (muda status para published)
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do artigo a ser publicado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artigo publicado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 *       404:
 *         description: Artigo não encontrado
 */
exports.publishArticle = async (req, res) => {
  try {
    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      { status: 'published', updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Artigo não encontrado' });
    res.json({ message: 'Artigo publicado', article: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{id}/revisions:
 *   get:
 *     summary: Lista as revisões (histórico) de um artigo
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do artigo para o qual se deseja ver o histórico
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de revisões do artigo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ArticleHistory'
 *       404:
 *         description: Artigo não encontrado
 */
exports.listRevisions = async (req, res) => {
  try {
    const revisions = await ArticleHistory.find({ articleId: req.params.id });
    res.json(revisions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         section:
 *           type: string
 *         userId:
 *           type: string
 *         status:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         attachments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               filename:
 *                 type: string
 *               uploadedAt:
 *                 type: string
 *                 format: date-time
 *         views:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     ArticleHistory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         articleId:
 *           type: string
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
 
exports.customRoutes = [
  {
    method: 'post',
    route: '/:id/restore/:historyId',
    auth: true,
    handler: exports.restoreVersion,
  },
  {
    method: 'post',
    route: '/:id/draft',
    auth: true,
    handler: exports.saveDraft,
  },
  {
    method: 'put',
    route: '/:id/publish',
    auth: true,
    handler: exports.publishArticle,
  },
  {
    method: 'get',
    route: '/:id/revisions',
    auth: true,
    handler: exports.listRevisions,
  },
];
