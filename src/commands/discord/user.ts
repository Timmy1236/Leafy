import extractColorFromImage from "../../utils/extractColor.js";
import { boolToSpanish, formatDateLong } from "../../utils/general.js";
import { SlashCommandBuilder, EmbedBuilder, time, TimestampStyles } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Obtén información de un usuario o del tuyo.")
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Usuario del que quieres obtener información.")
        .setRequired(false)
    ) as SlashCommandBuilder,
  categoria: "🌐 Discord",
  run: async (client, interaction): Promise<void> => {
    await interaction.deferReply();

    const user = interaction.options.getUser("usuario") || interaction.user;

    const guild = interaction.guild;

    const status = {
      online: "🟢 En Línea",
      idle: "🟠 Ausente",
      dnd: "🔴 No Molestar",
      offline: "⚫️ Desconectado",
      invisible: "⚫️ Desconectado"
    };

    if (!user || !guild) return;

    // Intentamos obtener el miembro del servidor
    const member = guild.members.cache.get(user.id);

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

      const rolesList
        = roles.length > 10
          ? `${roles.slice(0, 10).join(" | ")} y **${roles.length - 11}** roles más...`
          : roles.join(" | ");

      // Status
      const statusMember
        = member.presence?.status ? member.presence.status : "offline";

      // Banner (force fetch)
      const fetchedUser = await client.users.fetch(member.id, { force: true });
      const banner = fetchedUser.bannerURL({ size: 1024 });

      const embed = new EmbedBuilder()
        .setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
        .setColor(dominantColor)
        .addFields({
          name: `▸ ${client.botEmojis.discord} Discord`,
          value:
            `>>> **Usuario:** ${member.user.username} (<@!${member.id}>)\n`
            + `**Username Global:** ${member.user.globalName}\n`
            + `**ID:** ${member.id}\n`
            + `**Status:** ${status[statusMember]}\n`
            + `**Bot:** ${boolToSpanish(member.user.bot)}\n`
            + `**Cuenta creada en:** ${formatDateLong(member.user.createdAt)} (${time(member.user.createdAt, TimestampStyles.RelativeTime)})`
        })
        .addFields({
          name: `▸ ${client.botEmojis.discord} Server`,
          value:
            `**Ingreso en el:** ${formatDateLong(member.joinedAt!)} (${time(member.joinedAt!, TimestampStyles.RelativeTime)})\n`
            + `**Rol Alto:** ${String(member.roles.highest)}\n`
            + `**Rol Color:** ${String(member.roles.color)} (Hex: ${member.displayHexColor})`
        })
        .addFields({
          name: "▸ 🎖 Roles",
          value: `>>> ${rolesList}`
        });

      if (banner) embed.setImage(banner);

      await interaction.editReply({ embeds: [embed] });
    }

    // Usuario fuera del servidor
    else {
      const fetchedUser = await client.users.fetch(user.id, { force: true });

      const { dominantColor } = await extractColorFromImage(
        fetchedUser.displayAvatarURL({ extension: "png", size: 512 })
      );

      const banner = fetchedUser.bannerURL({ size: 1024 });

      const embed = new EmbedBuilder()
        .setThumbnail(fetchedUser.displayAvatarURL({ size: 1024 }))
        .setColor(dominantColor)
        .addFields({
          name: `▸ ${client.botEmojis.discord} Discord`,
          value:
            `>>> **Usuario:** ${fetchedUser.username} (<@!${fetchedUser.id}>)\n`
            + `**Username Global:** ${fetchedUser.globalName}\n`
            + `**ID:** ${fetchedUser.id}\n`
            + `**Bot:** ${boolToSpanish(fetchedUser.bot)}\n`
            + `**Cuenta creada en:** ${formatDateLong(fetchedUser.createdAt)} (${time(fetchedUser.createdAt, TimestampStyles.RelativeTime)})`
        });

      if (banner) embed.setImage(banner);

      await interaction.editReply({ embeds: [embed] });
    }
  }
};

export default command;
