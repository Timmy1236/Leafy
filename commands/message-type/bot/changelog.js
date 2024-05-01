const axios = require('axios');
module.exports = {
  nombre: "changelog",
  alias: [],
  descripcion: "Obtén información sobre los últimos cambios.",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping()

    async function fetchChangelog() {
      try {
        const response = await axios.get(client.changelogUrl);
        return response.data;
      } catch (error) {
        return "Error al intentar obtener información sobre del changelog.";
      }
    }

    try {
      const changelogData = await fetchChangelog();

      const changelogEmbed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setTitle('Changelog')
        .setDescription(changelogData)
      message.reply({ embeds: [changelogEmbed] })
    } catch (error) {
      message.reply({ content: `${client.emoji.warning} 『 **Acaba de ocurrir un error al intentar ejecutar el comando, inténtalo mas tarde.** 』` })
      console.error(error.message);
    }
  }
}