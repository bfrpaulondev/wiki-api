// models/Article.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  section:   { type: Schema.Types.ObjectId, ref: 'Section' },
  userId:    { type: Schema.Types.ObjectId, ref: 'User' },
  tags:      [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  attachments: [{
    url: String,
    filename: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  status:    { type: String, enum: ['draft', 'published'], default: 'draft' },
  views:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

module.exports = mongoose.model('Article', articleSchema);


/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único do artigo.
 *           example: "63f9c2f8e3b0a34567890abc"
 *         title:
 *           type: string
 *           description: Título do artigo.
 *           example: "Introdução ao MongoDB"
 *         content:
 *           type: string
 *           description: Conteúdo do artigo.
 *           example: "Este artigo explica os conceitos básicos do MongoDB..."
 *         section:
 *           type: string
 *           description: ID da seção à qual o artigo pertence.
 *           example: "63f9c2f8e3b0a34567890def"
 *         userId:
 *           type: string
 *           description: ID do usuário que criou o artigo.
 *           example: "63f9c2f8e3b0a34567890ghi"
 *         tags:
 *           type: array
 *           description: Lista de IDs das tags associadas ao artigo.
 *           items:
 *             type: string
 *             example: "63f9c2f8e3b0a34567890jkl"
 *         attachments:
 *           type: array
 *           description: Lista de anexos do artigo.
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "https://res.cloudinary.com/..."
 *               filename:
 *                 type: string
 *                 example: "imagem.jpg"
 *               uploadedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-12T12:00:00Z"
 *         status:
 *           type: string
 *           description: Status do artigo (draft ou published).
 *           enum: [draft, published]
 *           example: "draft"
 *         views:
 *           type: number
 *           description: Número de visualizações do artigo.
 *           example: 100
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação do artigo.
 *           example: "2025-02-12T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data da última atualização do artigo.
 *           example: "2025-02-13T15:30:00Z"
 */
