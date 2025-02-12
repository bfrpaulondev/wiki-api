const path = require('path');

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Recupera arquivos enviados
 */
exports.basePath = '/uploads';

/**
 * @swagger
 * /uploads/{fileId}:
 *   get:
 *     summary: Obtém um arquivo específico
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         description: Nome do arquivo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Arquivo retornado com sucesso
 */
exports.getFile = (req, res) => {
  const fileId = req.params.fileId;
  const filePath = path.join(__dirname, '..', 'uploads', fileId);
  res.sendFile(filePath);
};

exports.customRoutes = [
  { method: 'get', route: '/:fileId', handler: exports.getFile }
  
];