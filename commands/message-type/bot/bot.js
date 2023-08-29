const { execSync } = require('child_process');
const moment = require("moment");
const package = require('../../../package.json');
require("moment-duration-format")
module.exports = {
  nombre: "bot",
  alias: ["botinfo", "Leafy"],
  descripcion: "Obtén información sobre el bot.",
  categoria: "🤖 Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    message.channel.sendTyping()

    try {
      const activity = moment.duration(client.uptime).format(" D [Dias], H [Horas], m [Minutos], s [Segundos]");
      const npmVersion = execSync('npm -v').toString().trim();

      const userSize = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString();
      const serverSize = client.guilds.cache.size.toLocaleString();
      const channelSize = client.channels.cache.size.toLocaleString();

      const botEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: bot.botName, iconURL: bot.botAvatar })
        .setDescription(package.description)
        .setColor(bot.embedColor)
        .addFields({ name: `▸ 💻 Info`, value: `>>> **Lenguaje:** JavaScript\n**Discord.js:** v${Discord.version}\n**Node.js:** ${process.version}\n**NPM:** ${npmVersion}`, inline: true })
        .addFields({ name: `▸ 📈 Stats`, value: `>>> **Uptime:** ${activity}\n**Usuarios:** ${userSize}\n**Servers:** ${serverSize}\n**Canales:** ${channelSize}`, inline: true })
      message.reply({ embeds: [botEmbed] })

    } catch (error) {
      console.log(error);
    }
  }
}