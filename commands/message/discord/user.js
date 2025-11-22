const { extractColorFromImage } = require('../../../utils/extractColor.js');
const { moment, boolToSpanish, isValidSnowflake } = require('../../../utils/general.js')

module.exports = {
  nombre: "user",
  alias: ["usuario"],
  descripcion: "Obtén el información de un usuario o del tuyo.",
  categoria: "🌐 Discord",
  run: async (Discord, client, message, args, userDB, serverDB) => {
    let user = message.mentions.members.size > 0 ? message.mentions.users.first().id : undefined || args[0] || message.author.id;

    let status = {
      online: "🟢 En Línea",
      idle: "🟠 Ausente",
      dnd: "🔴 No Molestar",
      offline: "⚫️ Desconectado"
    };

    // Si la ID dada es válida, primero chequeamos si el usuario está en el servidor
    if (isValidSnowflake(user)) {
      if (message.guild.members.cache.get(user)) {
        const member = message.guild.members.cache.get(user);

        // Color dominante del pfp del usuario
        const { dominantColor } = await extractColorFromImage(member.user.displayAvatarURL({ extension: "png", size: 512 }));

        // Roles
        const roles = member.roles.cache.map((role) => role.toString()).sort((a, b) => b.position - a.position).map((r) => r);
        const rolesList = roles.length > 10 ? `${roles.slice(0, 10).join(" | ")} Y **${roles.length - 10 - 1}** roles más...` : roles.join(" | ");

        // Status
        const statusMember = member.presence && member.presence.status ? member.presence.status : "offline";

        // Banner
        const fetchedUser = await client.users.fetch(member.id, { force: true });
        const banner = fetchedUser.bannerURL({ dynamic: true, size: 1024 });

        const userInfo = new Discord.EmbedBuilder()
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
          .setColor(dominantColor)
          .addFields({
            name: `▸ ${client.botEmojis.discord} Discord`,
            value: `>>> **Usuario:** ${member.user.username} (<@!${member.id}>)\n` +
              `**Username Global:** ${member.user.globalName}\n` +
              `**ID:** ${member.id}\n` +
              `**Status:** ${status[statusMember]}\n` +
              `**Bot:** ${boolToSpanish(member.user.bot)}\n` +
              `**Cuenta creada en:** ${moment.utc(member.user.createdAt).format("LLLL")}(${Discord.time(fetchedUser.createdAt, Discord.TimestampStyles.RelativeTime)})`
          })
          .addFields({
            name: `▸ ${client.botEmojis.discord} Server`,
            value: ` >>> **Ingreso en el:** ${moment.utc(member.joinedAt).format("LLLL")}(${Discord.time(member.joinedAt, Discord.TimestampStyles.RelativeTime)})\n` +
              `**Rol Alto:** ${member.roles.highest}\n` +
              `**Rol Color:** ${member.roles.color}(Hex: ${member.displayHexColor})`
          })
          .addFields({
            name: "▸ 🎖 Roles",
            value: `>>> ${rolesList}`
          })

        if (banner) userInfo.setImage(banner);

        return message.reply({ embeds: [userInfo] });


        // En caso que el usuario del que usuario no se encuentre en el mismo server del bot, obtendremos la info de el desde el 'fetch', la info estará mas limitada obviamente.
      } else {
        client.users.fetch(user).then(async (user) => {
          // Color dominante del pfp del usuario
          const { dominantColor } = await extractColorFromImage(user.displayAvatarURL({ extension: "png", size: 512 }));

          // Banner
          const banner = user.bannerURL({ dynamic: true, size: 1024 })

          const userInfo = new Discord.EmbedBuilder()
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setColor(dominantColor)
            .addFields({
              name: `▸ ${client.botEmojis.discord} Discord`,
              value: ` >>> **Usuario:** ${user.username} (<@!${user.id}>)\n` +
                `**Username Global:** ${user.globalName}\n ** ID:** ${user.id}\n` +
                `**Bot:** ${boolToSpanish(user.bot)}\n` +
                `**Cuenta Creada en:** ${moment.utc(user.createdAt).format("LLLL")}(${Discord.time(user.createdAt, Discord.TimestampStyles.RelativeTime)})`
            })

          if (banner) userInfo.setImage(banner);

          return message.reply({ embeds: [userInfo] });
        });
      }
    } else {
      return message.reply({ content: `${client.botEmojis.error} 『 Ese usuario no existe. 』` })
    }
  }
};