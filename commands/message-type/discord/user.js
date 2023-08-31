const moment = require("moment");
const { getColorFromURL } = require("color-thief-node");
const axios = require("axios");
const config = require("../../../config.json");
module.exports = {
  nombre: "user",
  alias: ["usuario"],
  descripcion: "Obtén el información de un usuario o del tuyo.",
  categoria: "Discord",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    message.channel.sendTyping();
    // Obtener el usuario
    let user = message.mentions.members.size > 0 ? message.mentions.users.first().id : undefined || args[0] || message.author.id;
    let op;

    // Esto es para testear algo, no es necesario.
    if (user == "no-banner") {
      user = message.author.id
      op = "no-banner"
    }

    // Para checkear si la id del usuario es correcta
    function isValidSnowflake(id) {
      const snowflakeRegex = /^[0-9]{17,19}$/;
      return snowflakeRegex.test(id);
    }

    // Formato de fecha
    moment.updateLocale("es", { months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"), monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split("_"), weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"), weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"), weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_") });

    // Si el usuario es un bot
    let isUserBot = { false: "No 👤", true: "Si 🤖" };

    // Estados
    let status = { online: "🟢 En Línea", idle: "🟠 Ausente", dnd: "🔴 No molestar", offline: "⚫️ Desconectado/invisible" };

    // Obtener el banner del usuario por medio de Discord o Vencord
    async function getBanner(idUsuario) {
      try {
        const res = await axios.get(`https://discord.com/api/users/${user}`, {
          headers: {
            Authorization: `Bot ${config.TOKEN}`,
            "Accept-Encoding": "gzip,deflate,compress",
          },
        });

        const { banner } = res.data;

        // Discord Nitro
        if (banner) {
          const extension = banner.startsWith("a_") ? ".gif" : ".png";
          const url = `https://cdn.discordapp.com/banners/${idUsuario}/${banner}${extension}?size=1024`;

          return { url, source: "Discord Nitro" };
        } else {
          // Vencord USRBG
          const url = 'https://raw.githubusercontent.com/AutumnVN/usrbg/main/usrbg.json';
          const response = await axios.get(url);
          const jsonData = JSON.stringify(response.data);
          const link = getImageLinkById(jsonData, idUsuario);

          if (link) {
            return { url: link, source: "Vencord" };
          } else {
            // Si no tiene banner por nitro o vencord
            return "ERROR";
          }
        }
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }

    // Si el banner se encuentra en Vencord, esta función servirá para obtener el json del raw y buscar por su ID
    function getImageLinkById(jsonData, idUsuario) {
      try {
        const data = JSON.parse(jsonData);
        const link = data[idUsuario];

        if (link) {
          return link;
        } else {
          return null;
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return null;
      }
    }

    // Checkeamos en primer lugar si la id es valida
    if (isValidSnowflake(user)) {
      // Si el usuario esta en el mismo server del bot (member.user)
      if (message.guild.members.cache.get(user)) {
        const member = message.guild.members.cache.get(user);

        // Avatar el usuario
        const MemberAvatarURL = member.user.displayAvatarURL({ dynamic: true, size: 1024 });

        // El color "dominante" del avatar, servirá para colorear el embed.
        const dominantColor = await getColorFromURL(member.user.displayAvatarURL({ extension: "png", size: 512 }));

        // Los roles que tiene el usuario
        const roles = member.roles.cache.map((role) => role.toString()).sort((a, b) => b.position - a.position).map((r) => r);
        const rolesList = roles.length > 10 ? `${roles.slice(0, 10).join(" | ")} Y **${roles.length - 10 - 1}** roles más...` : roles.join(" | ");

        // Obtenemos el banner del usuario
        const result = await getBanner(member.id);

        // El status del usuario
        const statusMember = member.presence && member.presence.status ? member.presence.status : "offline";

        const userInfo = new Discord.EmbedBuilder()
          .setThumbnail(MemberAvatarURL)
          .setColor(dominantColor)
          .addFields({ name: "▸ <:FB_Discord:1104269881412685894> Discord", value: `>>> **Usuario:** ${member.user.username} (<@!${member.id}>)\n**Username Global:** ${member.user.globalName}\n**ID:** ${member.id}\n**Status:** ${status[statusMember]}\n**Bot:** ${isUserBot[member.user.bot]}\n**Cuenta creada en:** ${moment.utc(member.user.createdAt).format("LLLL")}` })
          .addFields({ name: "▸ <:FB_Discord:1104269881412685894> Server", value: `>>> **Ingreso en el:** ${moment.utc(member.joinedAt).format("LLLL")}\n**Rol Alto:** ${member.roles.highest}\n**Rol Color:** ${member.roles.color} (Hex: ${member.displayHexColor})` })
          .addFields({ name: "▸ 🎖 Roles", value: `>>> ${rolesList}` })

        if (result.source !== "ERROR" && op !== "no-banner") {
          userInfo.addFields({ name: '▸ 🖼️ Banner', value: `>>> [${result.source}](${result.url})` })
          userInfo.setImage(result.url)
          return message.reply({ embeds: [userInfo] });
        } else {
          return message.reply({ embeds: [userInfo] });
        }
      } else {
        client.users.fetch(user).then(async (us) => { // Si el usuario se encuentra fuera del server y el bot tiene que hacer fetch primero (us.)
          // Avatar del usuario
          const memberAvatarURL = us.displayAvatarURL({ dynamic: true, size: 1024 });

          // El color "dominante" del avatar, servirá para colorear el embed.
          const dominantColor = await getColorFromURL(us.displayAvatarURL({ extension: "png", size: 512 }));

          // Obtenemos el banner del usuario
          const result = await getBanner(us.id);

          const userInfo = new Discord.EmbedBuilder()
            .setThumbnail(memberAvatarURL)
            .setColor(dominantColor)
            .addFields({ name: "▸ <:FB_Discord:1104269881412685894> Discord", value: `>>> **Usuario:** ${us.username} (<@!${us.id}>)\n**Username Global:** ${us.globalName}\n**ID:** ${us.id}\n**Bot:** ${isUserBot[us.bot]}\n**Cuenta Creada en:** ${moment.utc(us.createdAt).format("LLLL")}` })

          if (result.source !== "ERROR") {
            userInfo.addFields({ name: '▸ 🖼️ Banner', value: `>>> [${result.source}](${result.url})` })
            userInfo.setImage(result.url)
            return message.reply({ embeds: [userInfo] });
          } else {
            return message.reply({ embeds: [userInfo] });
          }
        });
      }
    } else {
      return message.reply({ content: "❌ | Ese usuario no existe!" })
    }
  }
};