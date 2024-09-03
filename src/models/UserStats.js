const { Schema, model } = require('mongoose');

const userStatsSchema = new Schema({
    userId: String,
    username: String,
    guildId: String,
    messageCount: { type: Number, default: 0 },
    totalVoiceTime: { type: Number, default: 0 },
    voiceJoinTime: { type: Date, default: null }
});

module.exports = model('UserStats', userStatsSchema);
