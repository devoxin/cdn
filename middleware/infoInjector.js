const { service } = require('../config.json');

module.exports = {
  name: 'InfoInjector',
  options: {},
  setup: (server) => {
    server.use((req, res, next) => {
      res.locals = {
        serviceName: service.name
      };
      next();
    });
  }
};
