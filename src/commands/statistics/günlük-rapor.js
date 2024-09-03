const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserStats = require('../../models/UserStats'); // MongoDB modelimiz

module.exports = {
    data: new SlashCommandBuilder()
        .setName('günlük-rapor')
        .setDescription('Sunucudaki kullanıcıların günlük mesaj ve sesli kanal istatistiklerini gösterir.'),

    async execute(interaction) {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1); // 1 gün önceki tarih

        try {
            // Son 24 saatteki mesaj ve sesli kanal verilerini buluyoruz
            const dailyStats = await UserStats.find({
                guildId: interaction.guild.id,
                $or: [
                    { lastMessageTime: { $gte: oneDayAgo } },
                    { lastVoiceJoinTime: { $gte: oneDayAgo } }
                ]
            });

            if (!dailyStats || dailyStats.length === 0) {
                await interaction.reply('Son 24 saat içinde hiçbir aktivite kaydedilmedi.');
                return;
            }

            // Embed oluşturuyoruz
            const embed = new EmbedBuilder()
                .setTitle('Son 24 Saatlik Sunucu Aktivitesi')
                .setColor('#00ff99') // Embed'in rengini ayarlıyoruz
                .setTimestamp(); // Embed'e zaman damgası ekler

            // Her bir kullanıcının istatistiklerini embed'e ekleyelim
            dailyStats.forEach(user => {
                const messageCount = user.messageCount || 0;
                const totalVoiceTime = user.totalVoiceTime || 0;

                // Sesli kanal süresi saat, dakika, saniye olarak
                const hours = Math.floor(totalVoiceTime / 3600);
                const minutes = Math.floor((totalVoiceTime % 3600) / 60);
                const seconds = Math.floor(totalVoiceTime % 60);

                // Her kullanıcı için bir alan ekleyelim
                embed.addFields({
                    name: user.username,
                    value: `**Mesaj Sayısı:** ${messageCount}\n` +
                           `**Sesli Kanal Süresi:** ${hours} saat, ${minutes} dakika, ${seconds} saniye`,
                    inline: false
                });
            });

            // Embed'i yanıt olarak gönderiyoruz
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Günlük Rapor Hatası:', error);
            await interaction.reply('Günlük raporu oluştururken bir hata oluştu.');
        }
    }
};
