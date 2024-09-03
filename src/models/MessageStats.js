const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    userId: String,
    username: String,
    guildId: String,
    messageCount: { type: Number, default: 1 },
});

module.exports = model('MessageStats', messageSchema);