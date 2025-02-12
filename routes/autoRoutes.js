// routes/autoRoutes.js
const fs = require('fs');
const path = require('path');
const { authenticate } = require('../middleware/auth');

module.exports = (app) => {
  const controllersPath = path.join(__dirname, '..', 'controllers');

  fs.readdirSync(controllersPath).forEach(file => {
    if (file.endsWith('Controller.js')) {
      const controller = require(path.join(controllersPath, file));
      
      // Define o basePath: usa propriedade basePath se definida ou o nome do arquivo em minúsculo
      let basePath = controller.basePath || '/' + file.replace('Controller.js', '').toLowerCase();
      
      const router = require('express').Router();

      // Se o controller exportar customRoutes, registra-os
      if (controller.customRoutes && Array.isArray(controller.customRoutes)) {
        controller.customRoutes.forEach(routeDef => {
          if (routeDef.auth) {
            router[routeDef.method](routeDef.route, authenticate, routeDef.handler);
          } else {
            router[routeDef.method](routeDef.route, routeDef.handler);
          }
        });
      }

      // Registra automaticamente os endpoints CRUD se as funções estiverem definidas
      if (controller.listAll) {
        router.get('/', controller.listAll);
      }
      if (controller.create) {
        router.post('/', (req, res, next) => {
          if (controller.authCrud) {
            return authenticate(req, res, () => controller.create(req, res, next));
          } else {
            return controller.create(req, res, next);
          }
        });
      }
      if (controller.getById) {
        router.get('/:id', controller.getById);
      }
      if (controller.update) {
        router.put('/:id', (req, res, next) => {
          if (controller.authCrud) {
            return authenticate(req, res, () => controller.update(req, res, next));
          } else {
            return controller.update(req, res, next);
          }
        });
      }
      if (controller.delete) {
        router.delete('/:id', (req, res, next) => {
          if (controller.authCrud) {
            return authenticate(req, res, () => controller.delete(req, res, next));
          } else {
            return controller.delete(req, res, next);
          }
        });
      }

      // Monta o router com prefixo /api
      app.use('/api' + basePath, router);
    }
  });
};
