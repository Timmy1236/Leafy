const Discord = require("discord.js")
const { extractColorFromImage } = require('../../../utils/extractColor.js');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Obtén el avatar de un usuario que menciones")
    .addUserOption(option => option.setName('usuario').setDescription('El usuario que quieras obtener su avatar').setRequired(true)),
  categoria: "🌐 Discord",
  async run(client, interaction) {
    const avatar = await interaction.options.getUser('usuario').displayAvatarURL({ dynamic: true, size: 1024 })

    // Función para obtener el avatar con una extensión específica
    function getAvatarWithExtension(extension) {
      return interaction.options.getUser('usuario').displayAvatarURL({ extension: extension, size: 512 })
    }

    const { dominantColor, stringRgb, hex } = await extractColorFromImage(getAvatarWithExtension("png"));

    const avatarEmbed = new Discord.EmbedBuilder()
      .setAuthor({ name: interaction.options.getUser('usuario').username, iconURL: avatar })
      .setDescription(`▸ 📷 Formatos\n> [WEBP](${getAvatarWithExtension("webp")}) | [PNG](${getAvatarWithExtension("png")}) | [JPG](${getAvatarWithExtension("jpg")}) | [JPEG](${getAvatarWithExtension("jpeg")}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${hex}\n> RGB: ${stringRgb}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
      .setColor(dominantColor)
      .setImage(avatar)
    interaction.reply({ embeds: [avatarEmbed] })
  }
}