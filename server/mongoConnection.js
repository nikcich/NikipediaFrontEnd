const { MongoClient } = require('mongodb');
require('dotenv').config();
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);
const dbName = 'test';

async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('users');

    return 'MongoDB Connection Completed';
}

main()
    .then(console.log)
    .catch(console.error);

module.exports = client;

