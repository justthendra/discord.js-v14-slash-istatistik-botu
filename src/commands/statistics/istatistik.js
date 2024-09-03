const UserStats = require('../../models/UserStats');
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("istatistik")
    .setDescription(
      "Belirli bir kullanıcının mesaj ve sesli kanal istatistiklerini gösterir."
    )
    .addUserOption((option) =>
      option
        .setName("kullanıcı")
        .setDescription(
          "İstatistiklerini görmek istediğiniz kullanıcıyı seçin."
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("kullanıcı");
    const member = interaction.guild.members.cache.get(user.id);
    const userId = user.id;
    const guildId = interaction.guild.id;

    const userStats = await UserStats.findOne({ userId, guildId });

    if (!userStats) {
      await interaction.reply(`${user.username} için istatistik bulunamadı.`);
      return;
    }

    const messageCount = userStats.messageCount || 0;
    const totalVoiceTime = userStats.totalVoiceTime || 0;

    const hours = Math.floor(totalVoiceTime / 3600);
    const minutes = Math.floor((totalVoiceTime % 3600) / 60);
    const seconds = Math.floor(totalVoiceTime % 60);

    const userEmb = new EmbedBuilder()
      .setAuthor({
        name: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setDescription(`${user} kullanıcısının istatistikleri:`)
      .addFields(
        {
          name: "Sunucuya Katılma Tarihi",
          value: `\`${member.joinedAt.toLocaleString()}\``,
        },
        {
          name: "Hesap Oluşturma Tarihi",
          value: `\`${user.createdAt.toLocaleString()}\``,
        },
        { name: "Roller,", value: `${member.roles.cache.map(r => r).join(' ').replace("@everyone", " ")}` },
        { name: "Mesaj Sayısı", value: `${messageCount}` },
        {
          name: "Sesli Kanal",
          value: `${hours} saat, ${minutes} dakika, ${seconds} saniye`,
        }
      )
      .setColor("Random")
      .setFooter({
        text: `${interaction.user.tag} tarafından istendi`,
        iconURL: interaction.user.avatarURL(),
      })
      .setTimestamp();
    await interaction.reply({ embeds: [userEmb] });
  },
};
