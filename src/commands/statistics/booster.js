const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('boosters')
        .setDescription('Sunucuyu boost yapan kullanıcıları gösterir.'),
    async execute(interaction) {
        const boosters = interaction.guild.members.cache.filter(member => member.premiumSince);
        const boosterList = boosters.map(member => `${member.user.username}`).join(', ');

        if (boosterList) {
            const boosterEmb = new EmbedBuilder()
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setDescription(`Sunucuyu boostlayan kullanıcılar:`)
            .addFields(
                { name: 'Boostlayanlar', value: `${boosterList}` }
            )
            .setColor('Random')
            .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
            .setTimestamp()

            await interaction.reply({ embeds: [boosterEmb] });
        } else {

            const noBooster = new EmbedBuilder()
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setDescription(`Sunucuya boost basmış bir kullanıcı yok :(`)
            .setColor('Random')
            .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
            .setTimestamp()

            await interaction.reply({ embeds: [noBooster] });
        }
    }
};
