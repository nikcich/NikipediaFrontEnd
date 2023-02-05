const generateSessionId = require('../generateSessionId');
const sessions = require('../sessions');
const client = require('../mongoConnection');
const bcrypt = require('bcrypt');

async function comparePassword(plainPassword, hashedPassword) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
}

module.exports = async (req, res) => {
    const { username, password } = req.body;

    const db = client.db('test');
    const collection = db.collection('users');
    const query = { username: username };
    const matchUsername = await collection.findOne(query);

    if (!matchUsername) return res.status(401).json({ message: 'Login failed1' });

    comparePassword(password, matchUsername.password).then((result) => {
        if (!result) return res.status(401).json({ message: 'Login failed2' });

        const sessionId = generateSessionId(); // a helper function to generate a new session ID

        const sess = matchUsername;
        sess.sessionId = sessionId;
        sess.lastAlive = new Date();

        sessions.set(sessionId, sess);

        return res.status(200).json({ message: 'Log In Successfull', sessionId: sessionId });
    });
}