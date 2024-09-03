const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MessageStats = require('../../models/MessageStats');  // Doğru yoldan dosyayı dahil edin

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mesaj-istatistik')
        .setDescription('En çok mesaj atan kullanıcıları gösterir.'),

    async execute(interaction) {
        try {
            const stats = await MessageStats.find({ guildId: interaction.guild.id })
                .sort({ messageCount: -1 })
                .limit(10);
            if (stats.length === 0) {
                const noMessage = new EmbedBuilder()
                .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
                .setDescription(`Bu sunucuda henüz mesaj kaydı yok.`)
                .setColor('Random')
                .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
                .setTimestamp()
                await interaction.reply({ embeds: [noMessage] });
                return;
            }

            const leaderboard = stats.map((user, index) => `**${index + 1}. ${user.username}:** \`${user.messageCount} mesaj\``).join('\n');
            const leaderboardEmb = new EmbedBuilder()
            .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
            .setDescription(`Sunucudaki En Çok Mesaj Atan Kullanıcılar:\n${leaderboard}`)
            .setColor('Random')
            .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
            .setTimestamp()
            await interaction.reply({ embeds: [leaderboardEmb] });
        } catch (error) {
            console.error('Mesaj İstatistik Hatası:', error);
            await interaction.reply('Mesaj istatistiklerini alırken bir hata oluştu.');
        }
    }
};