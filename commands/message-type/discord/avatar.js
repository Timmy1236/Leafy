const { getColorFromURL } = require('color-thief-node');
module.exports = {
  nombre: "avatar",
  alias: ["pfp"],
  descripcion: "Muestra el avatar de alguien o el tuyo con su color dominante y en diferentes formatos.",
  categoria: "Discord",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    message.channel.sendTyping();
    let id = message.mentions.members.size > 0 ? message.mentions.users.first().id : undefined || args[0] || message.author.id
    client.users.fetch(id).then(async us => {
      const avatar = await us.displayAvatarURL({ dynamic: true, size: 1024 })
      const avatarWEBP = await us.displayAvatarURL({ extension: "webp", size: 512 })
      const avatarPNG = await us.displayAvatarURL({ extension: "png", size: 512 })
      const avatarJPG = await us.displayAvatarURL({ extension: "jpg", size: 512 })
      const avatarJPEG = await us.displayAvatarURL({ extension: "jpeg", size: 512 })
      const dominantColor = await getColorFromURL(avatarPNG);

      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      }

      function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
      }

      const avatarglobal = new Discord.EmbedBuilder()
        .setAuthor({ name: us.username, iconURL: avatar })
        .setDescription(`▸ 📷 Formatos\n> [WEBP](${avatarWEBP}) | [PNG](${avatarPNG}) | [JPG](${avatarJPG}) | [JPEG](${avatarJPEG}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2])}\n> RGB: ${dominantColor}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
        .setColor(dominantColor)
        .setImage(avatar)
        .setFooter({ text: `Obtén su banner: ${prefix}banner` })
      return message.reply({ embeds: [avatarglobal] })
    }).catch(e => console.error(e))
  }
}