const Discord = require("discord.js");
const { extractColorFromImage } = require("../../../utils/extractColor.js");
const { moment, boolToSpanish } = require('../../../utils/general.js')

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("user")
    .setDescription("Obtén información de un usuario o del tuyo.")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario del que quieres obtener información.")
        .setRequired(false)
    ),
  categoria: "🌐 Discord",
  async run(client, interaction) {
    await interaction.deferReply();

    const user = interaction.options.getUser("usuario") || interaction.user;

    const status = {
      online: "🟢 En Línea",
      idle: "🟠 Ausente",
      dnd: "🔴 No Molestar",
      offline: "⚫️ Desconectado"
    };

    const guild = interaction.guild;

    // Intentamos obtener el miembro del servidor
    let member = guild.members.cache.get(user.id);

    // Si el usuario está en el servidor
    if (member) {
      // Color dominante
      const { dominantColor } = await extractColorFromImage(
        member.user.displayAvatarURL({ extension: "png", size: 512 })
      );

      // Roles
      const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(r => r.toString());

      const rolesList =
        roles.length > 10
          ? `${roles.slice(0, 10).join(" | ")} y **${roles.length - 11}** roles más...`
          : roles.join(" | ");

      // Status
      const statusMember =
        member.presence?.status ? member.presence.status : "offline";

      // Banner (force fetch)
      const fetchedUser = await client.users.fetch(member.id, { force: true });
      const banner = fetchedUser.bannerURL({ dynamic: true, size: 1024 });

      const embed = new Discord.EmbedBuilder()
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(dominantColor)
        .addFields({
          name: `▸ ${client.botEmojis.discord} Discord`,
          value:
            `>>> **Usuario:** ${member.user.username} (<@!${member.id}>)\n` +
            `**Username Global:** ${member.user.globalName}\n` +
            `**ID:** ${member.id}\n` +
            `**Status:** ${status[statusMember]}\n` +
            `**Bot:** ${boolToSpanish(member.user.bot)}\n` +
            `**Cuenta creada en:** ${moment.utc(member.user.createdAt).format("LLLL")} (${Discord.time(member.user.createdAt, Discord.TimestampStyles.RelativeTime)})`
        })
        .addFields({
          name: `▸ ${client.botEmojis.discord} Server`,
          value:
            `>>> **Ingreso en el:** ${moment.utc(member.joinedAt).format("LLLL")} (${Discord.time(member.joinedAt, Discord.TimestampStyles.RelativeTime)})\n` +
            `**Rol Alto:** ${member.roles.highest}\n` +
            `**Rol Color:** ${member.roles.color} (Hex: ${member.displayHexColor})`
        })
        .addFields({
          name: "▸ 🎖 Roles",
          value: `>>> ${rolesList}`
        });

      if (banner) embed.setImage(banner);

      return interaction.editReply({ embeds: [embed] });
    }

    // Usuario fuera del servidor
    else {
      const fetchedUser = await client.users.fetch(user.id, { force: true });

      const { dominantColor } = await extractColorFromImage(
        fetchedUser.displayAvatarURL({ extension: "png", size: 512 })
      );

      const banner = fetchedUser.bannerURL({ dynamic: true, size: 1024 });

      const embed = new Discord.EmbedBuilder()
        .setThumbnail(fetchedUser.displayAvatarURL({ dynamic: true, size: 1024 }))
        .setColor(dominantColor)
        .addFields({
          name: `▸ ${client.botEmojis.discord} Discord`,
          value:
            `>>> **Usuario:** ${fetchedUser.username} (<@!${fetchedUser.id}>)\n` +
            `**Username Global:** ${fetchedUser.globalName}\n` +
            `**ID:** ${fetchedUser.id}\n` +
            `**Bot:** ${boolToSpanish(fetchedUser.bot)}\n` +
            `**Cuenta creada en:** ${moment.utc(fetchedUser.createdAt).format("LLLL")} (${Discord.time(fetchedUser.createdAt, Discord.TimestampStyles.RelativeTime)})`
        });

      if (banner) embed.setImage(banner);

      return interaction.editReply({ embeds: [embed] });
    }
  }
};
