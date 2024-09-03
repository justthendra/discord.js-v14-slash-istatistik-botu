const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Sunucudaki rollerin ve üye sayılarının listesini gösterir.'),
    async execute(interaction) {
        const roles = interaction.guild.roles.cache.map(role => `**${role.name}:** \`${role.members.size}\` üye`).join('\n');

        const rolesEmb = new EmbedBuilder()
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setDescription(`İşte roller ve üye sayıları;`)
        .addFields(
            { name: 'Roller ve Üye Sayıları', value: `${roles}` }
        )
        .setColor('Random')
        .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
        .setTimestamp()
        await interaction.reply({ embeds: [rolesEmb] });
    }
};
