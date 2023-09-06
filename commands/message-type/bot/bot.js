const { execSync } = require('child_process');
const moment = require("moment");
const package = require('../../../package.json');
require("moment-duration-format")
module.exports = {
  nombre: "bot",
  alias: ["botinfo", "Leafy"],
  descripcion: "Obtén información sobre el bot.",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping()

    try {
      const activity = moment.duration(client.uptime).format(" D [Dias], H [Horas], m [Minutos], s [Segundos]");

      const uptime = client.uptime;
      const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((uptime % (1000 * 60)) / 1000);

      const activity2 = `${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;

      console.log("activyty " + activity)
      console.log("activyty2 " + activity2)


      const npmVersion = execSync('npm -v').toString().trim();

      const userSize = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString();
      const serverSize = client.guilds.cache.size.toLocaleString();
      const channelSize = client.channels.cache.size.toLocaleString();

      const botEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
        .setDescription(package.description)
        .setColor(client.color)
        .addFields({ name: `▸ 💻 Info`, value: `>>> **Lenguaje:** JavaScript\n**Discord.js:** v${Discord.version}\n**Node.js:** ${process.version}\n**NPM:** ${npmVersion}`, inline: true })
        .addFields({ name: `▸ 📈 Stats`, value: `>>> **Uptime:** ${activity2}\n**Usuarios:** ${userSize}\n**Servers:** ${serverSize}\n**Canales:** ${channelSize}`, inline: true })
      message.reply({ embeds: [botEmbed] })

    } catch (error) {
      console.log(error);
    }
  }
}