const Discord = require("discord.js")
const axios = require("axios")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("obtener-emoji")
    .setDescription("Convierte los emojis de los servidores en imágenes descargabas")
    .addStringOption(option => option.setName('emoji').setDescription('El emoji que quieras descargar').setRequired(true)),
  categoria: "Discord",
  async run(client, interaction) {
    try {

      let emoji = interaction.options.getString('emoji')?.trim();

      if (emoji.startsWith("<") && emoji.endsWith(">")) {
        // Obtenemos la id del emoji
        const id = emoji.match(/\d{15,}/g)[0];

        // Obtenemos el tipo de emoji (gif o png)
        const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
          .then(image => {
            if (image) return "gif"
            else return "png"
          }).catch((err) => {
            return "png"
          });

        // Y creamos un link con la id y el type del emoji que después sera enviado al embed
        emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
      }

      // Si el emoji no empieza con http/s, puede ser que no sea un emoji o sino que si lo sea pero los que vienen por default con Discord.
      if (!emoji.startsWith("http") || !emoji.startsWith("https")) {
        return await interaction.reply({ content: `${client.emoji.warning} 『 **El emoji no es valido** 』`, ephemeral: true })
      }

      const embedEmoji = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setImage(emoji)

      interaction.reply({ embeds: [embedEmoji], ephemeral: true })
    } catch (error) {
      await interaction.reply({ content: `${client.emoji.error} 『 **Acaba de ocurrir un error al ejecutar el comando** 』`, ephemeral: true });
    }
  }
}