const { service, storage } = require('../config.json');
const { constants, promises: { access, mkdir, writeFile } } = require('fs');


/**
 * Creates the storage directory for uploaded files if it doesn't exist.
 * @returns {boolean} Whether the directory is available.
 */
async function checkStorageDirectory () {
  const directoryExists = await access(storage.directory, constants.R_OK)
    .then(() => true)
    .catch(() => false);

  if (!directoryExists) {
    return mkdir(storage.directory)
      .then(() => true)
      .catch(() => false);
  }

  return true;
}

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

  if (!await checkStorageDirectory()) {
    throw new SaveException('Unable to create the storage directory', 500);
  }

  const exists = await access(savePath, constants.R_OK)
    .then(() => true)
    .catch(() => false);

  if (exists) {
    throw new SaveException('A file with that name already exists', 400);
  }

  return writeFile(savePath, data)
    .then(() => {
      res.send(encodeURIComponent(`${service.domain}/${fileNameAndExt}`));
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
