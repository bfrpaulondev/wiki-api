// config/database.js
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://Bfrpaulon:ySguNepQ71gYSW3C@cluster0.7coxk.mongodb.net/';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));
