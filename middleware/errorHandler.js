module.exports = {
  name: 'ErrorHandler',
  options: {
    registerLast: true
  },
  setup: (server) => {
    server.use((req, res, next) => {
      res.status(404).render('notfound');
    });
  }
};
