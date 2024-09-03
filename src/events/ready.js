const { ActivityType, Events } = require('discord.js');
const config = require('../config.json')
const mongoose = require('mongoose');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        client.user.setStatus(config.bot.presence.status);
        client.user.setPresence({
            activities: [{
                name: config.bot.presence.text,
                type: ActivityType.Listening
            }]
        })

        mongoose.connect(config.bot.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log("MongoDB Bağlantısı Başarılı.");
        }).catch(err => {
            console.log("MongoDB Bağlantısı Başarısız: " + err);
        })

        console.log(client.user.username + " hazır!");
    }
}