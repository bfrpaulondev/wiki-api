const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wiki_uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf']
  }
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Gerencia uploads de arquivos e imagens via Cloudinary
 */
exports.basePath = '/upload';

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Faz o upload de um arquivo para o Cloudinary
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
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
 *         description: Arquivo enviado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Arquivo enviado com sucesso"
 *                 file:
 *                   type: object
 *                   properties:
 *                     path:
 *                       type: string
 *                       example: "https://res.cloudinary.com/.../image.jpg"
 *                     filename:
 *                       type: string
 *                       example: "123456789-image.jpg"
 *       400:
 *         description: Nenhum arquivo enviado
 *       500:
 *         description: Erro interno no servidor
 */
exports.uploadFile = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    res.status(201).json({
      message: 'Arquivo enviado com sucesso',
      file: req.file,
    });
  }
];

exports.customRoutes = [
  { method: 'post', route: '/', handler: exports.uploadFile, auth: true }
];
