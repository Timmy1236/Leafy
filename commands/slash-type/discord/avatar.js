const Discord = require("discord.js")
const { getColorFromURL } = require('color-thief-node');
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Obtén el avatar de un usuario que menciones")
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('El usuario que quieras obtener su avatar')
      .setRequired(true)
    ),
  categoria: "Discord",
  async run(client, interaction) {

    // Función para obtener el avatar con extensión
    function getAvatarWithExtension(extension) {
      return interaction.options.getUser('usuario').displayAvatarURL({ extension: extension, size: 512 })
    }

    // El color dominante del avatar
    const dominantColor = await getColorFromURL(getAvatarWithExtension("png"));

    // Función para convertir decimal a hexadecimal
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    // Función para convertir RGB a HEX
    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    const avatar = await interaction.options.getUser('usuario').displayAvatarURL({ dynamic: true, size: 1024 }) // Avatar del usuario en cualquier formato dado por Discord

    const avatarEmbed = new Discord.EmbedBuilder()
      .setAuthor({ name: interaction.options.getUser('usuario').username, iconURL: avatar })
      .setDescription(`▸ 📷 Formatos\n> [WEBP](${getAvatarWithExtension("webp")}) | [PNG](${getAvatarWithExtension("png")}) | [JPG](${getAvatarWithExtension("jpg")}) | [JPEG](${getAvatarWithExtension("jpeg")}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2])}\n> RGB: ${dominantColor}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
      .setColor(dominantColor)
      .setImage(avatar)

    interaction.reply({ embeds: [avatarEmbed] })
  }
}