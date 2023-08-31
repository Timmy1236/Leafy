const moment = require("moment");
const { getColorFromURL } = require("color-thief-node");
module.exports = {
  nombre: "serverinfo",
  alias: ["server", "guild", "guildinfo"],
  descripcion: "Información básica del servidor.",
  categoria: "Discord",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    message.channel.sendTyping();
    var server = message.guild;

    //Miembros
    var Members = server.members.cache.size;
    var memberCount = server.members.cache.filter((member) => !member.user.bot).size;
    var botCount = server.members.cache.filter((member) => member.user.bot).size;
    var onlineCount = server.members.cache.filter((m) => m.presence?.status === "online").size;
    var idleCount = server.members.cache.filter((m) => m.presence?.status === "idle").size;
    var dndCount = server.members.cache.filter((m) => m.presence?.status === "dnd").size;
    var offlineCount = ((await server.members.fetch()).filter((m) => m.presence?.status === "offline")).size;

    //Canales
    var categoryCount = server.channels.cache.filter((m) => m.type == Discord.ChannelType.GuildCategory).size;
    var textCount = server.channels.cache.filter((m) => m.type == Discord.ChannelType.GuildText).size;
    var voiceCount = server.channels.cache.filter((m) => m.type == Discord.ChannelType.GuildVoice).size;
    var newsCount = server.channels.cache.filter((m) => m.type == Discord.ChannelType.GuildNews).size;
    var threadCount = server.channels.cache.filter((m) => m.type == Discord.ChannelType.GuildPublicThread).size;

    //Icono
    let icon16 = server.iconURL({ size: 16, dynamic: true });
    let icon32 = server.iconURL({ size: 32, dynamic: true });
    let icon64 = server.iconURL({ size: 64, dynamic: true });
    let icon128 = server.iconURL({ size: 128, dynamic: true });
    let icon256 = server.iconURL({ size: 256, dynamic: true });
    let icon512 = server.iconURL({ size: 512, dynamic: true });
    let icon1024 = server.iconURL({ size: 1024, dynamic: true });
    let icon2048 = server.iconURL({ size: 2048, dynamic: true });
    let icon4096 = server.iconURL({ size: 4096, dynamic: true });
    let iconURL = server.iconURL({ size: 1024, dynamic: true });

    //Emojis
    let emojis = [] //Estáticos
    let emojis_a = [] //Animados
    server.emojis.cache.filter(x => !x.animated).map(x => emojis.push(`<:${x.name}:${x.id}>`))
    server.emojis.cache.filter(x => x.animated).map(x => emojis_a.push(`<a:${x.name}:${x.id}>`))
    const emojiEstaticos = emojis.length > 10 ? `${emojis.slice(0, 10).join(" | ")} Y **${emojis.length - 10 - 1}** emojis más...` : emojis.join(" | ");
    const emojiAnimados = emojis_a.length > 10 ? `${emojis_a.slice(0, 10).join(" | ")} Y **${emojis_a.length - 10 - 1}** emojis más...` : emojis_a.join(" | ");

    //Formato de fecha
    moment.updateLocale("es", { months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"), monthsShort: "Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.".split("_"), weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"), weekdaysShort: "Dom._Lun._Mar._Mier._Jue._Vier._Sab.".split("_"), weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sa".split("_") });

    //Owner
    const Owner = await server.fetchOwner();

    //Roles
    const roles = await server.roles.cache.filter((role) => role.id !== message.guild.id && !role.managed).sort((a, b) => b.position - a.position).map((role) => role.toString()).map((r) => r);
    const rolist = (await roles.length) > 15 ? `${roles.slice(0, 15).join(" | ")} Y **${roles.length - 15}** roles más...` : roles.join(" | ");

    //Color
    const dominantColor = await getColorFromURL(server.iconURL({ size: 1024, extension: "png" }));

    const serverInfo = new Discord.EmbedBuilder()
      .setColor(dominantColor)
      .setThumbnail(iconURL)
      .setAuthor({ name: server.name, iconURL: server.iconURL() })
      .addFields({ name: "▸ 📃 Información", value: `>>> **Nombre:** ${server.name}\n**ID:** ${server.id}\n**Dueño del servidor:** ${Owner.user.username}\n**Fecha de creación:** ${moment.utc(server.createdAt).format("LLLL")}` })
      .addFields({ name: "▸ 💬 Canales", value: `>>> ${categoryCount} Categorías 📁\n${textCount} Canales de texto 💬\n${voiceCount} Canales de voz 🔊\n${newsCount} Canales de noticias 🗞️\n${threadCount} Hilos 🧵`, inline: true })
      .addFields({ name: "▸ 👥 Usuarios", value: `>>> ${botCount} Bot 🤖\n${memberCount} Usuarios 👤\n${Members} Miembros en total 👥\n${onlineCount} Conectados 🟢\n${idleCount} Ausentes 🟡\n${dndCount} No Molestar 🔴\n${offlineCount} Desconectados ⚫`, inline: true })
      .addFields({ name: "▸ 🎖 Roles", value: `>>> ${rolist}` })
      .addFields({ name: "▸ 😀 Emojis", value: `>>> ${emojiEstaticos}` })
      .addFields({ name: "▸ 😎 Emojis animados", value: `>>> ${emojiAnimados}` })
      .addFields({ name: "▸ 🖼 Icono", value: `>>> [16](${icon16}) [32](${icon32}) [64](${icon64}) [128](${icon128}) [256](${icon256}) [512](${icon512}) [1024](${icon1024}) [2048](${icon2048}) [4096](${icon4096})` });
    return message.reply({ embeds: [serverInfo] });
  },
};