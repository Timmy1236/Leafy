const moment = require("moment");
const { getColorFromURL } = require("color-thief-node");
module.exports = {
  nombre: "serverinfo",
  alias: ["server", "guild", "guildinfo"],
  descripcion: "Información básica del servidor.",
  categoria: "Discord",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping();

    //Servidor
    var server = message.guild;

    //Miembros
    var memberCount = server.members.cache.filter((member) => !member.user.bot).size;
    var botCount = Members - memberCount;
    var Members = server.members.cache.size;

    // Función para obtener el conteo de miembros por estado
    function getMemberCountByStatus(status) {
      return server.members.cache.filter((m) => m.presence?.status === status).size;
    }

    // Función para obtener el conteo de canales por tipo
    function getChannelCountByType(type) {
      return server.channels.cache.filter((c) => c.type === type).size;
    }

    //Icono
    let iconURL = server.iconURL({ size: 1024, dynamic: true }); // Default

    function getCustomIconSize(size) {
      return server.iconURL({ size: size, dynamic: true });
    }

    //Emojis
    let emojis = [] //Estáticos
    let emojis_animated = [] //Animados
    server.emojis.cache.filter(x => !x.animated).map(x => emojis.push(`<:${x.name}:${x.id}>`))
    server.emojis.cache.filter(x => x.animated).map(x => emojis_animated.push(`<a:${x.name}:${x.id}>`))
    const emojiEstaticos = emojis.length > 10 ? `${emojis.slice(0, 10).join(" | ")} Y **${emojis.length - 10 - 1}** emojis más...` : emojis.join(" | ");
    const emojiAnimados = emojis_animated.length > 10 ? `${emojis_animated.slice(0, 10).join(" | ")} Y **${emojis_animated.length - 10 - 1}** emojis más...` : emojis_animated.join(" | ");

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
      .addFields({ name: "▸ 💬 Canales", value: `>>> ${getChannelCountByType(Discord.ChannelType.GuildCategory)} Categorías 📁\n${getChannelCountByType(Discord.ChannelType.GuildText)} Canales de texto 💬\n${getChannelCountByType(Discord.ChannelType.GuildVoice)} Canales de voz 🔊\n${getChannelCountByType(Discord.ChannelType.GuildNews)} Canales de noticias 🗞️\n${getChannelCountByType(Discord.ChannelType.GuildPublicThread)} Hilos 🧵`, inline: true })
      .addFields({ name: "▸ 👥 Usuarios", value: `>>> ${botCount} Bot 🤖\n${memberCount} Usuarios 👤\n${Members} Miembros en total 👥\n${getMemberCountByStatus("online")} Conectados 🟢\n${getMemberCountByStatus("idle")} Ausentes 🟡\n${getMemberCountByStatus("dnd")} No Molestar 🔴\n${getMemberCountByStatus("offline")} Desconectados ⚫`, inline: true })
      .addFields({ name: "▸ 🎖 Roles", value: `>>> ${rolist}` })
      .addFields({ name: "▸ 😀 Emojis", value: `>>> ${emojiEstaticos}` })
      .addFields({ name: "▸ 😎 Emojis animados", value: `>>> ${emojiAnimados}` })
      .addFields({ name: "▸ 🖼 Icono", value: `>>> [16](${getCustomIconSize(16)}) [32](${getCustomIconSize(32)}) [64](${getCustomIconSize(64)}) [128](${getCustomIconSize(128)}) [256](${getCustomIconSize(256)}) [512](${getCustomIconSize(512)}) [1024](${getCustomIconSize(1024)}) [2048](${getCustomIconSize(2048)}) [4096](${getCustomIconSize(4096)})` });
    return message.reply({ embeds: [serverInfo] });
  },
};