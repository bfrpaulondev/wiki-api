// controllers/commentsController.js
const Comment = require('../models/Comment');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gerencia comentários e respostas nos artigos
 */

exports.basePath = '/articles/:articleId/comments';
exports.authCrud = true;

/**
 * @swagger
 * /articles/{articleId}/comments:
 *   get:
 *     summary: Lista os comentários principais de um artigo
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Erro interno no servidor
 */
exports.listAll = async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId, parentComment: null });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{articleId}/comments:
 *   post:
 *     summary: Adiciona um comentário a um artigo
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Este é um comentário de exemplo."
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Erro interno no servidor
 */
exports.create = async (req, res) => {
  try {
    const comment = new Comment({
      articleId: req.params.articleId,
      content: req.body.content,
      userId: req.user ? req.user.id : null,
      parentComment: null
    });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{articleId}/comments/{commentId}/replies:
 *   get:
 *     summary: Lista as respostas de um comentário
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID do comentário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de respostas do comentário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Erro interno no servidor
 */
exports.listReplies = async (req, res) => {
  try {
    const replies = await Comment.find({ parentComment: req.params.commentId });
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{articleId}/comments/{commentId}/replies:
 *   post:
 *     summary: Adiciona uma resposta a um comentário
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID do comentário ao qual a resposta será adicionada
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Esta é uma resposta ao comentário."
 *     responses:
 *       201:
 *         description: Resposta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Erro interno no servidor
 */
exports.createReply = async (req, res) => {
  try {
    const reply = new Comment({
      articleId: req.params.articleId,
      content: req.body.content,
      userId: req.user ? req.user.id : null,
      parentComment: req.params.commentId
    });
    const saved = await reply.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  { method: 'get', route: '/', auth: true, handler: exports.listAll },
  { method: 'post', route: '/', auth: true, handler: exports.create },
  { method: 'get', route: '/:commentId/replies', auth: true, handler: exports.listReplies },
  { method: 'post', route: '/:commentId/replies', auth: true, handler: exports.createReply },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890def"
 *         articleId:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890abc"
 *         content:
 *           type: string
 *           example: "Comentário de exemplo"
 *         userId:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890abc"
 *         parentComment:
 *           type: string
 *           nullable: true
 *           example: null
 *         upvotes:
 *           type: number
 *           example: 3
 *         downvotes:
 *           type: number
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-02-12T12:00:00Z"
 */
