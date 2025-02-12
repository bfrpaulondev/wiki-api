// controllers/commentController.js
const Comment = require('../models/Comment');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Gerencia comentários individualmente
 */

exports.basePath = '/comments';
exports.authCrud = true;

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Remove um comentário específico
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do comentário
 *     responses:
 *       200:
 *         description: Comentário removido com sucesso
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
