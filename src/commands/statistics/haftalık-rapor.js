const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); // discord.js v14'te EmbedBuilder kullanılır
const UserStats = require('../../models/UserStats'); // MongoDB modelimiz

module.exports = {
    data: new SlashCommandBuilder()
        .setName('haftalık-rapor')
        .setDescription('Sunucudaki kullanıcıların haftalık mesaj ve sesli kanal istatistiklerini gösterir.'),

    async execute(interaction) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // 7 gün önceki tarih

        try {
            // Son bir haftadaki mesaj ve sesli kanal verilerini buluyoruz
            const weeklyStats = await UserStats.find({
                guildId: interaction.guild.id,
                $or: [
                    { lastMessageTime: { $gte: oneWeekAgo } },
                    { lastVoiceJoinTime: { $gte: oneWeekAgo } }
                ]
            });

            if (!weeklyStats || weeklyStats.length === 0) {
                await interaction.reply('Son 7 gün içinde hiçbir aktivite kaydedilmedi.');
                return;
            }

            // Embed oluşturuyoruz
            const embed = new EmbedBuilder()
                .setTitle('Son 7 Günlük Sunucu Aktivitesi')
                .setColor('#0099ff') // Embed'in rengini ayarlıyoruz
                .setTimestamp(); // Embed'e zaman damgası ekler

            // Her bir kullanıcının istatistiklerini embed'e ekleyelim
            weeklyStats.forEach(user => {
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
                    inline: false // İstatistiklerin alt alta görünmesi için
                });
            });

            // Embed'i yanıt olarak gönderiyoruz
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Haftalık Rapor Hatası:', error);
            await interaction.reply('Haftalık raporu oluştururken bir hata oluştu.');
        }
    }
};
