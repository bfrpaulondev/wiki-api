const User = require('../models/User');
const Article = require('../models/Article');

 /**
  * @swagger
  * tags:
  *   name: Users
  *   description: Gerencia as configurações e favoritos do usuário
  */
exports.basePath = '/users';
exports.authCrud = true;

/**
 * @swagger
 * /users/me/favorites:
 *   get:
 *     summary: Lista os artigos favoritos do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de artigos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Article'
 *       500:
 *         description: Erro interno no servidor
 */
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /articles/{id}/favorite:
 *   post:
 *     summary: Adiciona ou remove um artigo dos favoritos do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do artigo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status de favorito atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Erro interno no servidor
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const articleId = req.params.id;
    const index = user.favorites.indexOf(articleId);
    let message = '';
    if (index === -1) {
      user.favorites.push(articleId);
      message = 'Artigo adicionado aos favoritos';
    } else {
      user.favorites.splice(index, 1);
      message = 'Artigo removido dos favoritos';
    }
    await user.save();
    res.json({ message, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /users/me/settings:
 *   get:
 *     summary: Obtém as configurações do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configurações do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Erro interno no servidor
 */
exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    res.json(user.settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @swagger
 * /users/me/settings:
 *   put:
 *     summary: Atualiza as configurações do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example: { theme: "dark", notifications: true }
 *     responses:
 *       200:
 *         description: Configurações atualizadas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 settings:
 *                   type: object
 *       500:
 *         description: Erro interno no servidor
 */
exports.updateSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.settings = req.body;
    await user.save();
    res.json({ message: 'Configurações atualizadas', settings: user.settings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.customRoutes = [
  { method: 'get', route: '/me/favorites', auth: true, handler: exports.getFavorites },
  { method: 'post', route: '/articles/:id/favorite', auth: true, handler: exports.toggleFavorite },
  { method: 'get', route: '/me/settings', auth: true, handler: exports.getSettings },
  { method: 'put', route: '/me/settings', auth: true, handler: exports.updateSettings },
];
