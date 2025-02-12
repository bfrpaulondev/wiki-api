// controllers/uploadsController.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuração do armazenamento para o Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wiki_uploads', // Pasta onde os uploads serão armazenados no Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf']
  },
});

// Configuração do multer usando o storage do Cloudinary
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Gerencia uploads de arquivos e imagens via Cloudinary
 */

exports.basePath = '/upload';

// Endpoint para upload de arquivo para o Cloudinary
exports.uploadFile = [
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo enviado' });
    }
    // O objeto req.file conterá os dados retornados pelo Cloudinary, como o URL do arquivo
    res.status(201).json({
      message: 'Arquivo enviado com sucesso',
      file: req.file,
    });
  }
];

exports.customRoutes = [
  {
    method: 'post',
    route: '/',
    handler: exports.uploadFile,
    auth: true // Caso deseje que apenas usuários autenticados possam fazer upload
  },
];
