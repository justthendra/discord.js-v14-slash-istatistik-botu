const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ses-aktiflik')
        .setDescription('Ses kanallarındaki en aktif kullanıcıları gösterir.'),
    async execute(interaction) {
        const voiceMembers = interaction.guild.members.cache.filter(member => member.voice.channel);
        const activeUsers = voiceMembers.map(member => `${member.user.username}: ${member.voice.channel.name}`).join('\n');

        if (activeUsers) {

            const activeEmb = new EmbedBuilder()
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setDescription(`Ses kanallarındaki aktif kullanıcılar:`)
            .addFields(
                { name: 'Aktif Kullanıcılar', value: `${activeUsers}` }
            )
            .setColor('Random')
            .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
            .setTimestamp()

            await interaction.reply({ embeds: [activeEmb] });
        } else {

            const noactiveEmb = new EmbedBuilder()
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setDescription(`Ses kanallarında aktif kullanıcı yok :(`)
            .setColor('Random')
            .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
            .setTimestamp()

            await interaction.reply({ embeds: [noactiveEmb] });
        }
    }
};
