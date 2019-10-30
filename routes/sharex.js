const { isKeyAuthorized } = require('../utils/checks.js');
const { save } = require('../utils/write.js');
const multer = require('multer')();

module.exports = {
  method: 'post',
  path: 'sharex',
  middleware: [multer.any()],
  handler: async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).send('This endpoint requires valid authorization.');
    }

    if (!isKeyAuthorized(authorization)) {
      return res.status(401).send('You do not have access to this service.');
    }

    const uploadedFile = req.files[0];

    if (!uploadedFile) {
      return res.status(400).send('A file must be provided.');
    }

    save(uploadedFile.originalname, null, uploadedFile.buffer)
      .then(path => {
        res.json({ path });
      })
      .catch(e => {
        res.status(e.status).json({ error: e.message });
      });
  }
};
