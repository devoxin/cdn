const Database = require('./database.js');
const db = new Database();


/**
 * Checks whether a user ID is in the databaase.
 * @param {string} id The user ID to check.
 * @returns {Promise<boolean>} Whether the user is authorized.
 */
function isUserAuthorized (id) {
  return db.users.findOne({ _id: id }).then(Boolean);
}

/**
 * Checks whether a key is in the database.
 * @param {string} key The key to check.
 * @returns {Promise<boolean>} Whether the key is authorized.
 */
function isKeyAuthorized (key) {
  return db.users.findOne({ uploadKey: key }).then(Boolean);
}

/**
 * Checks whether a user has a given flag.
 * @param {string} id The user ID to check against.
 * @param {integer} flag The flag to check for.
 * @returns {Promise<boolean>} Whether the flag exists.
 */
function userHasFlag (id, flag) {
  // eslint-disable-next-line no-extra-parens
  // return db.users.findOne({ _id: id }).then(result => (result.flags & (1 << flag)) !== 0);
  return db.users.findOne({ _id: id }).then(result => (result.flags & flag) === flag));
}

module.exports = {
  isKeyAuthorized,
  isUserAuthorized,
  userHasFlag
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
  "loggingEnabled": boolean,
  "flags": integer
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

flags
Any flags against the user's account that gives them special privileges, etc. Such as admin.
*/