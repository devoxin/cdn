const { storage } = require('../config.json');
const { isUserAuthorized } = require('../utils/checks.js');
const { promises: { access, writeFile }, constants } = require('fs');
const multer = require('multer')();

module.exports = {
  method: 'post',
  path: '/upload',
  middleware: [multer.single('file')],
  handler: async ({ user, file }, res) => {
    if (!user) {
      return res.status(401).send('You must login first.');
    }

    if (!isUserAuthorized(user.id)) {
      return res.status(401).send('You do not have access to this service.');
    }

    if (!file) {
      return res.status(400).send('You need to provide a file.');
    }

    const exists = await access(`${storage.directory}/${file.originalname}`, constants.R_OK)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      return res.status(400).send('A file with that name already exists!');
    }

    writeFile(`${path}/${file.originalname}`, file.buffer)
      .then(() => {
        res.send(encodeURIComponent(file.originalname));
      })
      .catch(err => {
        res.status(500).send(err.message);
      });
  }
}
