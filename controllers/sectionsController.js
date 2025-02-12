// controllers/sectionsController.js
const Section = require('../models/Section');

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Gerencia as seções da Wiki
 */

exports.basePath = '/sections';
exports.authCrud = true;

/**
 * @swagger
 * /sections:
 *   get:
 *     summary: Lista todas as seções
 *     tags: [Sections]
 *     responses:
 *       200:
 *         description: Retorna uma lista de seções
 */
exports.listAll = async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sections:
 *   post:
 *     summary: Cria uma nova seção
 *     tags: [Sections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seção criada com sucesso
 */
exports.create = async (req, res) => {
  try {
    const section = new Section({ name: req.body.name });
    const saved = await section.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sections/{id}:
 *   get:
 *     summary: Obtém detalhes de uma seção
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da seção
 *     responses:
 *       200:
 *         description: Detalhes da seção
 */
exports.getById = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) return res.status(404).json({ message: 'Seção não encontrada' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sections/{id}:
 *   put:
 *     summary: Atualiza uma seção
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da seção a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seção atualizada com sucesso
 */
exports.update = async (req, res) => {
  try {
    const updated = await Section.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Seção não encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /sections/{id}:
 *   delete:
 *     summary: Remove uma seção
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da seção a ser removida
 *     responses:
 *       200:
 *         description: Seção removida com sucesso
 */
exports.delete = async (req, res) => {
  try {
    const removed = await Section.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Seção não encontrada' });
    res.json({ message: 'Seção removida' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
