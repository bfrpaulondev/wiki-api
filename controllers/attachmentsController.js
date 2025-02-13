// controllers/attachmentsController.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Article = require('../models/Article');
require('dotenv').config();

// Configuração do Cloudinary (já configurado anteriormente)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração do armazenamento para anexos via Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wiki_attachments',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf']
  }
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Attachments
 *   description: Gerencia anexos de artigos
 */

exports.basePath = '/articles/:id/attachments';
exports.authCrud = true;

/**
 * @swagger
 * /articles/{id}/attachments:
 *   post:
 *     summary: Adiciona um anexo a um artigo
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do artigo ao qual o anexo será adicionado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Anexo adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Nenhum arquivo enviado
 *       404:
 *         description: Artigo não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
exports.addAttachment = [
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: 'Nenhum arquivo enviado' });
      // Atualiza o artigo adicionando o anexo
      const attachment = {
        url: req.file.path,
        filename: req.file.filename,
        uploadedAt: new Date()
      };
      const updated = await Article.findByIdAndUpdate(
        req.params.id,
        { $push: { attachments: attachment } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Artigo não encontrado' });
      res.status(201).json({ message: 'Anexo adicionado', article: updated });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

/**
 * @swagger
 * /articles/{id}/attachments:
 *   get:
 *     summary: Lista os anexos de um artigo
 *     tags: [Attachments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do artigo para o qual se deseja listar os anexos
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de anexos do artigo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                   filename:
 *                     type: string
 *                   uploadedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Artigo não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
exports.listAttachments = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id).select('attachments');
    if (!article) return res.status(404).json({ message: 'Artigo não encontrado' });
    res.json(article.attachments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  { method: 'post', route: '/', auth: true, handler: exports.addAttachment },
  { method: 'get', route: '/', auth: true, handler: exports.listAttachments },
];
