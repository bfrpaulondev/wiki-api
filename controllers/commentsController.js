// controllers/commentsController.js
const Comment = require('../models/Comment');

/**
 * @swagger
 * tags:
 *   name: Comments (Aninhados)
 *   description: Gerencia comentários em artigos
 */

exports.basePath = '/articles/:articleId/comments';
exports.authCrud = true;

/**
 * @swagger
 * /articles/{articleId}/comments:
 *   get:
 *     summary: Lista comentários de um artigo
 *     tags: [Comments (Aninhados)]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do artigo
 *     responses:
 *       200:
 *         description: Lista de comentários
 */
exports.listAll = async (req, res) => {
  try {
    const comments = await Comment.find({ articleId: req.params.articleId });
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
 *     tags: [Comments (Aninhados)]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do artigo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário adicionado com sucesso
 */
exports.create = async (req, res) => {
  try {
    const comment = new Comment({
      articleId: req.params.articleId,
      content: req.body.content,
      userId: req.user ? req.user.id : null,
    });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
