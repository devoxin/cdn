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
};

/**
 * @TODO Mongo integration.
 */

/*
Example DB schema
{
  "id": "string",
  "uploadKey": "string",
  "deleteAfter": integer
  "loggingEnabled": boolean
}

id
The user's Discord account ID. Used for uploading from the dashboard and account management.

uploadKey
The authorization key used by third party clients (such as ShareX) for uploading.

deleteAfter
The time an upload should live before it's deleted from the server. This applies to all
uploads and can be overriden with a `X-upload-ttl` header.

loggingEnabled
Whether uploads are attached to the account. Enabling this will allow users to manage
files they've uploaded -- such as removing them.
*/