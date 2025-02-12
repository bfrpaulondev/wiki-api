// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
  settings: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do usuário.
 *           example: "63f9c2f8e3b0a34567890abc"
 *         username:
 *           type: string
 *           description: Nome de usuário.
 *           example: "meuUser"
 *         email:
 *           type: string
 *           description: Email do usuário.
 *           example: "meuemail@exemplo.com"
 *         password:
 *           type: string
 *           description: Senha do usuário (hash).
 *         favorites:
 *           type: array
 *           description: Lista de IDs de artigos favoritos.
 *           items:
 *             type: string
 *         settings:
 *           type: object
 *           description: Configurações personalizadas do usuário.
 *           example: { "theme": "dark", "notifications": true }
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do usuário.
 *           example: "2025-02-12T12:00:00Z"
 */
