const Tag = require('../models/Tag');

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Gerencia as tags dos artigos
 */
exports.basePath = '/tags';
exports.authCrud = true;

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Lista todas as tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Lista de tags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Erro interno no servidor
 */
exports.listAll = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Cria uma nova tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "JavaScript"
 *     responses:
 *       201:
 *         description: Tag criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tag'
 *       500:
 *         description: Erro interno no servidor
 */
exports.create = async (req, res) => {
  try {
    const tag = new Tag({ name: req.body.name });
    const saved = await tag.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  { method: 'get', route: '/', handler: exports.listAll },
  { method: 'post', route: '/', auth: true, handler: exports.create },
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Tag:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           example: "63f9c2f8e3b0a34567890mno"
 *         name:
 *           type: string
 *           example: "JavaScript"
 */
