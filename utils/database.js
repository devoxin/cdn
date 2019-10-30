const { mongo: { address, port, db } } = require('../config.json');
const { MongoClient } = require('mongodb');

class Database {
  constructor () {
    this.connect();
  }

  async connect () {
    this.client = await MongoClient.connect(`mongodb://${address}:${port}`);
    this.db = this.client.db(db);
    this.users = this.db.collection('users');
  }
}

module.exports = Database;
