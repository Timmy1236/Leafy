const { execSync } = require('child_process');
const package = require('../../../package.json');
module.exports = {
  nombre: "bot",
  alias: ["botinfo", "leafy", "info"],
  descripcion: "Información básica del bot.",
  categoria: "🤖 Bot",
  run: async (Discord, client, message, _args, _userDB, _serverDB) => {
    try {
      const uptime = client.uptime;

      // Formateamos el tiempo de actividad del bot
      const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
      const activity = `${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;

      // Obtenemos la version del NPM
      const npmVersion = execSync('npm -v').toString().trim();

      const userSize = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString();
      const serverSize = client.guilds.cache.size.toLocaleString();
      const channelSize = client.channels.cache.size.toLocaleString();

      const githubButton = new Discord.ButtonBuilder()
        .setLabel('GitHub')
        .setURL('https://github.com/Timmy1236/Leafy')
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
      message.reply({ content: `${client.botEmojis.warning} 『 **Acaba de ocurrir un error al intentar ejecutar el comando, inténtalo mas tarde.** 』` })
      console.error(error.message);
    }
  }
}