// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.basePath = '/auth';

// Não usamos CRUD automático para auth; registramos endpoints customizados
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
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
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
