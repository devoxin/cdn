const { isUserAuthorized } = require('../utils/checks.js');
const { save } = require('../utils/write.js');
const multer = require('multer')();

module.exports = {
  method: 'post',
  path: '/upload',
  middleware: [multer.single('file')],
  handler: ({ user, file }, res) => {
    if (!user) {
      return res.status(401).send('This endpoint requires valid authorization.');
    }

    if (!isUserAuthorized(user.id)) {
      return res.status(401).send('You do not have access to this service.');
    }

    if (!file) {
      return res.status(400).send('A file must be provided.');
    }

    save(file.originalname, file.buffer)
      .then(path => {
        res.send(path);
      })
      .catch(e => {
        res.status(e.status).send(e.message);
      });
  }
};
