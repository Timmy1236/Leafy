const { execSync } = require('child_process');
const moment = require("moment");
const package = require('../../../package.json');
module.exports = {
  nombre: "bot",
  alias: ["botinfo", "Leafy", "info"],
  descripcion: "Información sobre el bot.",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping()

    try {
      // Obtenemos el tiempo de actividad del bot
      const uptime = client.uptime;

      // Formateamos el tiempo de actividad del bot
      const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
      const activity = `${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;

      // Obtenemos la version del NPM
      const npmVersion = execSync('npm -v').toString().trim();

      // Obtenemos el tamaño en total de los usuarios, servidores y canales
      const userSize = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString();
      const serverSize = client.guilds.cache.size.toLocaleString();
      const channelSize = client.channels.cache.size.toLocaleString();

      // Botones
      const githubButton = new Discord.ButtonBuilder()
        .setLabel('GitHub')
        .setURL('https://github.com/Awi-Corp/Leafy')
        .setStyle(Discord.ButtonStyle.Link);

      const row = new Discord.ActionRowBuilder()
        .addComponents(githubButton);

      const botEmbed = new Discord.EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.avatarURL() })
        .setDescription(package.description)
        .setColor(client.color)
        .addFields({ name: `▸ 💻 Info`, value: `>>> **Lenguaje:** JavaScript\n**Discord.js:** v${Discord.version}\n**Node.js:** ${process.version}\n**NPM:** ${npmVersion}`, inline: true })
        .addFields({ name: `▸ 📈 Stats`, value: `>>> **Uptime:** ${activity}\n**Usuarios:** ${userSize}\n**Servers:** ${serverSize}\n**Canales:** ${channelSize}`, inline: true })
      message.reply({ embeds: [botEmbed], components: [row] })

    } catch (error) {
      message.reply({ content: `${client.emoji.warning} 『 **Acaba de ocurrir un error al intentar ejecutar el comando, inténtalo mas tarde.** 』` })
      console.error(error.message);
    }
  }
}