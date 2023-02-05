const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const getSession = require('./getSession');
const loginRoute = require('./Routes/Login');
const signupRoute = require('./Routes/Signup');
const client = require('./mongoConnection');
const http = require('http').createServer(app);
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.use(cookieParser());
app.use(cors());
app.use(cors({
    origin: '*',
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // Replace * with the origin URL that should be allowed
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


app.get('/', function (req, res) {
    res.send('Hello World')
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/login', urlencodedParser, loginRoute);

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/profile', (req, res) => {

    if (!req.body || !req.body.sessionId) return res.status(401).send('Not authorized');

    const session = getSession(req.body.sessionId);

    if (session == null) return res.status(401).send('Not authorized');

    res.send(`Hello, ${session.username}`);
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/signup', urlencodedParser, signupRoute);

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/logout', urlencodedParser, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Error logging out' });
        }

        res.send({ message: 'Logout successful' });
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/getchats', async (req, res) => {

    if (!req.body || !req.body.sessionId) return res.status(401).send('Not authorized');

    const session = getSession(req.body.sessionId);

    if (session == null) return res.status(401).send('Not authorized');

    const chats = session.chats;
    const db = client.db('test');
    const chatCollection = db.collection('chats');

    let chatInfo = [];
    if (chats?.length > 0) {
        for (let id of chats) {
            const query = { chatId: id };
            const matchChat = await chatCollection.findOne(query);
            if (!matchChat) continue;

            chatInfo.push(matchChat);
        }
    }

    res.send({ chats: chatInfo });
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/getmessages', async (req, res) => {

    if (!req.body || !req.body.sessionId) return res.status(401).send('Not authorized');

    const session = getSession(req.body.sessionId);

    if (session == null) return res.status(401).send('No Session');

    if (!req.body.chat || req.body.chat == null || req.body.chat == undefined) return res.status(401).send('No chat id');

    if (req.body.page == null || req.body.page == undefined) return res.status(401).send('No page');

    const chatId = req.body.chat;
    const db = client.db('test');
    const chatCollection = db.collection('chats');

    const query = { chatId: chatId };
    const matchChat = await chatCollection.findOne(query);

    if (!matchChat) return res.status(401).send('No Matching Chat');

    if (req.body?.current == null || req.body?.current == undefined) return res.status(401).send('No Current');

    const messageCollection = db.collection('messages');

    let msgMatch = await messageCollection
        .find(query)
        .sort({ $natural: -1 })
        .skip(req.body.current)
        .limit(20)
        .toArray();

    const userCollection = db.collection('users');
    for (let i in msgMatch) {
        let curr = msgMatch[i];
        const userQuery = { userId: curr.sender };
        const senderName = await userCollection.findOne(userQuery);

        msgMatch[i]["senderName"] = senderName?.username ?? "ERROR";

        if (curr.sender == session.userId) {
            msgMatch[i]["kind"] = true;
        } else {
            msgMatch[i]["kind"] = false;
        }
    }

    res.send({ messages: msgMatch });
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/adduser', async (req, res) => {

    if (!req.body || !req.body.sessionId) return res.status(401).send('Not authorized');

    if (!req.body.username || !req.body.chatId) return res.status(401).send('Not authorized');

    const session = getSession(req.body.sessionId);

    if (session == null) return res.status(401).send('Not authorized');

    const chatId = req.body.chatId;
    const db = client.db('test');
    const chatCollection = db.collection('chats');

    const query = { chatId: chatId };
    const matchChat = await chatCollection.findOne(query);

    if (!matchChat) return res.status(401).send('No Matching Chat');

    if (!matchChat.admins.includes(session.userId)) return res.status(401).send('Not authorized');

    const userCollection = db.collection('users');
    const userQuery = { username: req.body.username };
    const matchUser = await userCollection.findOne(userQuery);

    if (!matchUser) return res.status(401).send('No Matching User');

    if (matchUser.chats.includes(chatId)) return res.status(409).send('User already in chat');

    userCollection.updateOne(userQuery, { $set: { chats: [...matchUser.chats, chatId] } }, function (err, res) {

    });

    res.sendStatus(200);
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/banuser', async (req, res) => {

    if (!req.body || !req.body.sessionId) return res.status(401).send('Not authorized');

    if (!req.body.username || !req.body.chatId) return res.status(401).send('Not authorized');

    const session = getSession(req.body.sessionId);

    if (session == null) return res.status(401).send('Not authorized');

    const chatId = req.body.chatId;
    const db = client.db('test');
    const chatCollection = db.collection('chats');

    const query = { chatId: chatId };
    const matchChat = await chatCollection.findOne(query);

    if (!matchChat) return res.status(401).send('No Matching Chat');

    if (!matchChat.admins.includes(session.userId)) return res.status(401).send('Not authorized');

    const userCollection = db.collection('users');
    const userQuery = { username: req.body.username };
    const matchUser = await userCollection.findOne(userQuery);

    if (!matchUser) return res.status(401).send('No Matching User');

    if (!matchUser.chats.includes(chatId)) return res.status(409).send('User not in chat');

    let index = matchUser.chats.indexOf(chatId);
    if (index !== -1) {
        matchUser.chats.splice(index, 1);
    }

    userCollection.updateOne(userQuery, { $set: { chats: matchUser.chats } }, function (err, res) {

    });

    res.sendStatus(200);
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

app.post('/leavechat', async (req, res) => {

    if (!req.body || !req.body.sessionId) return res.status(401).send('Not authorized');

    if (!req.body.userId || !req.body.chatId) return res.status(401).send('Not authorized');

    const session = getSession(req.body.sessionId);

    if (session == null) return res.status(401).send('Not authorized');

    const chatId = req.body.chatId;
    const db = client.db('test');
    const chatCollection = db.collection('chats');

    const query = { chatId: chatId };
    const matchChat = await chatCollection.findOne(query);

    if (!matchChat) return res.status(401).send('No Matching Chat');

    if (session.userId != req.body.userId) return res.status(401).send('Not authorized');

    const userCollection = db.collection('users');
    const userQuery = { userId: req.body.userId };
    const matchUser = await userCollection.findOne(userQuery);

    if (!matchUser) return res.status(401).send('No Matching User');

    if (!matchUser.chats.includes(chatId)) return res.status(409).send('User not in chat');

    let index = matchUser.chats.indexOf(chatId);
    if (index !== -1) {
        matchUser.chats.splice(index, 1);
    }

    userCollection.updateOne(userQuery, { $set: { chats: matchUser.chats } }, function (err, res) {

    });

    res.sendStatus(200);
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', async (socket) => {
    console.log('a user connected');
    let socketSession = null;

    socket.on("session-link", (sessionId) => {
        sessionId = sessionId ?? null;
        if (sessionId != null) {
            socketSession = sessionId;
        }
    });

    // const db = client.db('test');
    // const collection = db.collection('chats');

    // collection.find({}).sort({ timestamp: -1 }).limit(pageSize).skip((pageNumber - 1) * pageSize).toArray(function (err, docs) {
    //     if (err) throw err;
    //     console.log("Documents:", docs);
    //     client.close();
    // });

    socket.on('whoami', async (message) => {
        const session = getSession(socketSession ?? null);
        if (session == null) return;

        socket.emit('whoareyou', session.userId);
    });

    socket.on("message", async (message) => {
        const session = getSession(socketSession ?? null);
        if (session == null || !message?.content) return;

        const db = client.db('test');
        const chatCollection = db.collection('chats');

        const query = { chatId: message.chatId };
        const matchChat = await chatCollection.findOne(query);

        if (!matchChat) {
            return;
        }

        const messageCollection = db.collection('messages');

        const structuredMessage = {
            content: message.content,
            sender: session.userId,
            chatId: message.chatId,
            timestamp: Date.now(),
            messageId: uuidv4(),
        };

        messageCollection.insertOne(structuredMessage, (err, res) => {
            if (err) return;
        });

        io.emit(message.chatId, { ...structuredMessage, senderName: session.username });
    });


    socket.on('disconnect', () => {
        const session = getSession(socketSession ?? null);
        if (session == null) return;

        console.log("Disconnecting from: ", session);
    });
});

http.listen(5000, () => {
    console.log('listening on *:3000');
});