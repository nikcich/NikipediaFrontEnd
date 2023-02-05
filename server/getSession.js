const sessions = require('./sessions');

module.exports = function (sessionId) {
    const session = sessions.get(sessionId);

    if(!session){
        return null;
    }

    return session;
}