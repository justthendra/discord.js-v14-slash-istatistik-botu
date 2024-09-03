const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sunucu-bilgi')
        .setDescription('Sunucu bilgilerini gösterir.'),
    async execute(interaction) {
        
        let region;
        switch (interaction.guild.preferredLocale) {
            case "en-US":
                region = 'İngilizce (ABD) 🇺🇸';
                break;
            case "en-GB":
                region = 'İngilizce (Birleşik Krallık) 🇬🇧';
                break;
            case "es-ES":
                region = 'İspanyolca 🇪🇸';
                break;
            case "fr":
                region = 'Fransızca 🇫🇷';
                break;
            case "de":
                region = 'Almanca 🇩🇪';
                break;
            case "sv-SE":
                region = 'İsveççe 🇸🇪';
                break;
            case "tr":
                region = 'Türkçe 🇹🇷';
                break;
            case "ru":
                region = 'Rusça 🇷🇺';
                break;
            case "zh-CN":
                region = 'Çince (Basitleştirilmiş) 🇨🇳';
                break;
            case "ja":
                region = 'Japonca 🇯🇵';
                break;
        }

        const totalMembers = interaction.guild.memberCount;
        const onlineMembers = interaction.guild.members.cache.filter(member => member.presence?.status === 'online' || 'dnd' || 'idle').size;
        const botCount = interaction.guild.members.cache.filter(member => member.user.bot).size;
        const owner = await interaction.guild.fetchOwner();


        const serverEmb = new EmbedBuilder()
        .setAuthor({name: interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setDescription(`İşte sunucunun bilgileri;`)
        .addFields(
            { name: 'Sunucu Adı', value: `${interaction.guild.name}`, inline: true },
            { name: 'Sunucu ID', value: `\`${interaction.guild.id}\``, inline: true },
            { name: 'Sunucu Sahibi', value: `${owner}`, inline: true },
            { name: 'Sunucu Bölgesi', value: `${region}`, inline: true },
            { name: 'Sunucu Oluşturulma Tarihi', value: `${interaction.guild.createdAt.toLocaleString()}`, inline: true },
            { name: 'Sunucu Üye Sayısı', value: `${totalMembers}`, inline: true },
            { name: 'Çevrimiçi Üye Sayısı', value: `${onlineMembers}`, inline: true },
            { name: 'Bot Sayısı', value: `${botCount}`, inline: true },
            { name: 'Sunucu Boost Sayısı', value: `${interaction.guild.premiumSubscriptionCount}` || '0', inline: true },
            { name: 'Sunucu Boost Seviyesi', value: `${interaction.guild.premiumTier}` || '0', inline: true },
        )
        .setColor('Random')
        .setFooter({text: `${interaction.user.tag} tarafından istendi`, iconURL: interaction.user.avatarURL()})
        .setTimestamp()

        await interaction.reply({ embeds: [serverEmb] });

    }
};