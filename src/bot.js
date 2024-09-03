const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js")
const config = require("./config.json")

const fs = require('node:fs');
const path = require('node:path')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ],
    shards: "auto",
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[UYARI]  ${filePath} isimli komut "data" ve "execute" tanımı içermiyor.`);
		}
	}
}

const { REST, Routes } = require('discord.js');

const commands = [];

for (const folder of commandFolders) {
	
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[UYARI]  ${filePath} isimli komut "data" ve "execute" tanımı içermiyor.`);
		}
	}
}

const rest = new REST().setToken(config.bot.token);

(async () => {
	try {
		console.log(`${commands.length} entegrasyon (/) komutu yükleniyor.`);

		
		const data = await rest.put(
			Routes.applicationCommands(config.bot.client_id),
			{ body: commands },
		);

		console.log(`${data.length} entegrasyon (/) komutu yüklendi.`);
	} catch (error) {
		
		console.error(error);
	}
})();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

module.exports = client;

process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
})


const MessageStats = require('./models/MessageStats');
const UserStats = require('./models/UserStats');

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    try {
        const userStats = await MessageStats.findOne({
            userId: message.author.id,
            guildId: message.guild.id
        });

		const userStatistics = await UserStats.findOne({ userId: message.author.id, guildId: message.guild.id });


        if (userStats) {
            userStats.messageCount += 1;
            await userStats.save();
        } else {
            await MessageStats.create({
                userId: message.author.id,
                username: message.author.username,
                guildId: message.guild.id,
                messageCount: 1
            });
        }

		if (userStatistics) {
            userStatistics.messageCount += 1;
            await userStatistics.save();
        } else {
            await UserStats.create({
                userId: message.author.id,
                username: message.author.username,
                guildId: message.guild.id,
				
                messageCount: 1
            });
        }
    } catch (error) {
        console.error('Mesaj Kaydetme Hatası:', error);
    }
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (!newState.guild) return;

    const userId = newState.id;
    const guildId = newState.guild.id;
	const UserStats = require('./models/UserStats');  // Doğru yoldan dosyayı dahil edin

    try {
        let userStats = await UserStats.findOne({ userId, guildId });

        // Kullanıcı sesli kanala katılırsa giriş zamanını kaydet
        if (!oldState.channelId && newState.channelId) {
            if (!userStats) {
                userStats = await UserStats.create({
                    userId,
                    username: newState.member.user.username,
                    guildId,
                    voiceJoinTime: new Date()
                });
            } else {
                userStats.voiceJoinTime = new Date();
                await userStats.save();
            }
        }

        // Kullanıcı sesli kanaldan çıkarsa geçen süreyi ekle
        if (oldState.channelId && !newState.channelId) {
            if (userStats && userStats.voiceJoinTime) {
                const voiceSessionTime = (new Date() - new Date(userStats.voiceJoinTime)) / 1000; // Saniye cinsinden
                userStats.totalVoiceTime += voiceSessionTime;
                userStats.voiceJoinTime = null;
                await userStats.save();
            }
        }
    } catch (error) {
        console.error('Ses Kanalı Takip Hatası:', error);
    }
});


client.login(config.bot.token)