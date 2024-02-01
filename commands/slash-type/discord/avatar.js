const Discord = require("discord.js")
const { getColorFromURL } = require('color-thief-node');
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Obtén el avatar de un usuario o el propio tuyo")
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('El usuario que quieras obtener su avatar')
      .setRequired(false)
    ),
  categoria: "Discord",
  async run(client, interaction) {

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
      return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    if (interaction.options.getUser('usuario')) {
      const avatar = await interaction.options.getUser('usuario').displayAvatarURL({ dynamic: true, size: 1024 })
      const avatarWEBP = await interaction.options.getUser('usuario').displayAvatarURL({ extension: "webp", size: 512 })
      const avatarPNG = await interaction.options.getUser('usuario').displayAvatarURL({ extension: "png", size: 512 })
      const avatarJPG = await interaction.options.getUser('usuario').displayAvatarURL({ extension: "jpg", size: 512 })
      const avatarJPEG = await interaction.options.getUser('usuario').displayAvatarURL({ extension: "jpeg", size: 512 })
      const dominantColor = await getColorFromURL(avatarPNG);
      const avatarglobal = new Discord.EmbedBuilder()
        .setAuthor({ name: interaction.options.getUser('usuario').username, iconURL: avatar })
        .setDescription(`▸ 📷 Formatos\n> [WEBP](${avatarWEBP}) | [PNG](${avatarPNG}) | [JPG](${avatarJPG}) | [JPEG](${avatarJPEG}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2])}\n> RGB: ${dominantColor}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
        .setColor(dominantColor)
        .setImage(avatar)

      interaction.reply({ embeds: [avatarglobal] })
    } else {
      const avatar = await interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })
      const avatarWEBP = await interaction.user.displayAvatarURL({ extension: "webp", size: 512 })
      const avatarPNG = await interaction.user.displayAvatarURL({ extension: "png", size: 512 })
      const avatarJPG = await interaction.user.displayAvatarURL({ extension: "jpg", size: 512 })
      const avatarJPEG = await interaction.user.displayAvatarURL({ extension: "jpeg", size: 512 })
      const dominantColor = await getColorFromURL(avatarPNG);
      const avatarglobal = new Discord.EmbedBuilder()
        .setAuthor({ name: interaction.user.username, iconURL: avatar })
        .setDescription(`▸ 📷 Formatos\n> [WEBP](${avatarWEBP}) | [PNG](${avatarPNG}) | [JPG](${avatarJPG}) | [JPEG](${avatarJPEG}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2])}\n> RGB: ${dominantColor}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
        .setColor(dominantColor)
        .setImage(avatar)
      interaction.reply({ embeds: [avatarglobal] })
    }
  }
}