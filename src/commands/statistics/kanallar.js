const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channnels')
        .setDescription('Sunucudaki kanallar hakkında bilgi verir.'),
    async execute(interaction) {
        const channels = interaction.guild.channels.cache;

        const textChannels = channels.filter(channel => channel.type === 0).size; // Metin kanalları
        const voiceChannels = channels.filter(channel => channel.type === 2).size; // Sesli kanallar
        const categoryChannels = channels.filter(channel => channel.type === 4).size; // Kategori kanalları
        const stageChannels = channels.filter(channel => channel.type === 13).size; // Sahne kanalları

        const channelsEmb = new EmbedBuilder()
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setDescription(`İşte kanal bilgileri;`)
        .addFields(
            { name: 'Metin Kanalları', value: `${textChannels}`, inline: true },
            { name: 'Ses Kanalları', value: `${voiceChannels}`, inline: true },
            { name: 'Kategori Kanalları', value: `${categoryChannels}`, inline: true },
            { name: 'Sahne Kanalları', value: `${stageChannels}`, inline: true }
        )
        .setColor('Random')
        .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
        .setTimestamp()
        await interaction.reply({ embeds: [channelsEmb] });
    }
};
