// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.basePath = '/auth';

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: "meuUser"
 *               email:
 *                 type: string
 *                 example: "meuemail@exemplo.com"
 *               password:
 *                 type: string
 *                 example: "minhaSenha"
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e gera um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "meuemail@exemplo.com"
 *               password:
 *                 type: string
 *                 example: "minhaSenha"
 *     responses:
 *       200:
 *         description: Token JWT gerado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Falha na autenticação (usuário não encontrado ou senha incorreta)
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtém os detalhes do usuário logado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalhes do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Erro interno no servidor
 */

/**
 * @swagger
 * /auth/update-password:
 *   put:
 *     summary: Atualiza a senha do usuário logado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "senhaAntiga"
 *               newPassword:
 *                 type: string
 *                 example: "novaSenha"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Senha atual incorreta
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno no servidor
 */

exports.customRoutes = [
  {
    method: 'post',
    route: '/register',
    handler: async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashed });
        const saved = await user.save();
        res.status(201).json(saved);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  },
  {
    method: 'post',
    route: '/login',
    handler: async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Senha incorreta' });
        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET || 'secretkey',
          { expiresIn: '1h' }
        );
        res.json({ token });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  },
  {
    method: 'get',
    route: '/me',
    auth: true,
    handler: async (req, res) => {
      try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  },
  {
    method: 'put',
    route: '/update-password',
    auth: true,
    handler: async (req, res) => {
      try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
        const valid = await bcrypt.compare(oldPassword, user.password);
        if (!valid) return res.status(401).json({ message: 'Senha atual incorreta' });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Senha atualizada com sucesso' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  },
];
