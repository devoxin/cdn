/**
 * Checks whether a user ID is in the databaase.
 * @param {string} id The user ID to check.
 * @returns {boolean} Whether the user is authorized.
 */
function isUserAuthorized (id) {
  return true;
}

/**
 * Checks whether a key is in the database.
 * @param {string} key The key to check.
 * @returns {boolean} Whether the key is authorized.
 */
function isKeyAuthorized (key) {
  return true;
}

module.exports = {
  isKeyAuthorized,
  isUserAuthorized
}

/**
 * @TODO Mongo integration.
 */