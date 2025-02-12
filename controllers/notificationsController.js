// controllers/notificationsController.js
const Notification = require('../models/Notification');

 /**
  * @swagger
  * tags:
  *   name: Notifications
  *   description: Gerencia notificações dos usuários
  */

exports.basePath = '/notifications';
exports.authCrud = true;

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lista as notificações do usuário logado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de notificações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Erro interno no servidor
 */
exports.listAll = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Marca uma notificação como lida
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da notificação
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notificação não encontrada
 *       500:
 *         description: Erro interno no servidor
 */
exports.markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Notificação não encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Endpoint interno para criar notificações (pode ser chamado por outros controllers)
 * @param {string} userId - ID do usuário para o qual a notificação será criada.
 * @param {string} message - Mensagem da notificação.
 * @returns {Promise<Object>} A notificação criada.
 */
exports.createNotification = async (userId, message) => {
  try {
    const notification = new Notification({ userId, message });
    return await notification.save();
  } catch (err) {
    console.error('Erro ao criar notificação:', err.message);
  }
};

exports.customRoutes = [
  { method: 'get', route: '/', auth: true, handler: exports.listAll },
  { method: 'put', route: '/:id/read', auth: true, handler: exports.markAsRead },
  
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890jkl"
 *         userId:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890abc"
 *         message:
 *           type: string
 *           example: "Você tem um novo comentário."
 *         read:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-02-12T12:00:00Z"
 */
