// controllers/commentController.js
const Comment = require('../models/Comment');

exports.basePath = '/comments';
exports.authCrud = true;

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Remove um comentário
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do comentário a ser removido
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentário removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Comentário removido"
 *       404:
 *         description: Comentário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
exports.delete = async (req, res) => {
  try {
    const removed = await Comment.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Comentário não encontrado' });
    res.json({ message: 'Comentário removido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /comments/{id}/upvote:
 *   post:
 *     summary: Realiza upvote no comentário
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do comentário a ser upvotado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentário atualizado com o upvote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
exports.upvote = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Comentário não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /comments/{id}/downvote:
 *   post:
 *     summary: Realiza downvote no comentário
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID do comentário a ser downvotado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comentário atualizado com o downvote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: Comentário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
exports.downvote = async (req, res) => {
  try {
    const updated = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { downvotes: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Comentário não encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  { method: 'delete', route: '/:id', auth: true, handler: exports.delete },
  { method: 'post', route: '/:id/upvote', auth: true, handler: exports.upvote },
  { method: 'post', route: '/:id/downvote', auth: true, handler: exports.downvote },
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
