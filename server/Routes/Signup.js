const client = require('../mongoConnection');
const bcrypt = require('bcrypt');
const generateSessionId = require('../generateSessionId');
const sessions = require('../sessions');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
    const { email, username, password } = req.body;

    const db = client.db('test');
    const collection = db.collection('users');
    const query = { username: username };
    const matchUsername = await collection.findOne(query);

    if (matchUsername) return res.status(500).json({ message: 'Username already exists' });

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({ error: 'Failed to hash password' });
            return;
        }

        const readableUserID = uuidv4();

        const newElement = {
            username: username,
            password: hash,
            email: email,
            chats: [],
            userId: readableUserID,
        };

        collection.insertOne(newElement, function (err, res) {
            if (err) return res.status(500).json({ message: 'Signup Failed' });

        });

        const sessionId = generateSessionId(); // a helper function to generate a new session ID

        const sess = {};
        sess.username = username;
        sess.sessionId = sessionId;
        sess.lastAlive = new Date();

        sessions.set(sessionId, sess);

        res.status(200).json({ message: 'Signup successful', sessionId: sessionId });
    });
}