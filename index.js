const express = require('express');
const path = require('path');
const autoRoutes = require('./routes/autoRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();

// Inicializa o Express
const app = express();
app.use(express.json());
const cors = require('cors');

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin }));

// Conexão com o banco de dados
require('./config/database');

// Configurar Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wiki API',
            version: '1.0.0',
            description: 'API para gerenciamento de Wiki',
        },
        servers: [
            {
                url: 'https://wiki-api-glte.onrender.com/api/',
                description: 'Servidor de desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [path.join(__dirname, '/controllers/*.js'), path.join(__dirname, '/models/*.js')],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servir a página inicial
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Registra automaticamente os controllers via autoRoutes
autoRoutes(app);

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
