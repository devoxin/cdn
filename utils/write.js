const { storage } = require('../config.json');
const { promises: { access, writeFile }, constants } = require('fs');


/**
 * Writes a file to disk.
 * @param {string} filename The name of the file.
 * @param {string?} extension The extension of the file.
 * @param {buffer} data The data to write to the disk.
 * @returns {string} The link to the file, including the domain.
 */
async function save (filename, extension, data) {
  if (!extension && filename.includes('.')) {
    const fileExtension = filename.split('.').pop();

    if (fileExtension.length > 0 && filename.substring(1) !== fileExtension) {
      extension = fileExtension;
    }
  }

  const formattedExtension = extension ? `.${extension}` : '';
  const fileNameAndExt = filename + formattedExtension;
  const savePath = `${storage.directory}/${fileNameAndExt}`;

  const exists = await access(savePath, constants.R_OK)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    throw new SaveException('A file with that name already exists', 400);
  }

  return writeFile(savePath, file.buffer)
    .then(() => {
      /** @TODO include domain name */
      res.send(encodeURIComponent(fileNameAndExt));
    })
    .catch(writeError => {
      throw new SaveException(writeError.message, 500);
    });
}

class SaveException extends Error {
  constructor (message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = {
  save,
  SaveException
};
