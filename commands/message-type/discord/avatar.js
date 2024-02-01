const { getColorFromURL } = require('color-thief-node');
module.exports = {
  nombre: "avatar",
  alias: ["pfp"],
  descripcion: "Muestra el avatar de alguien o el tuyo con su color dominante y en diferentes formatos.",
  categoria: "Discord",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping();

    // Obtenemos el ID del usuario
    let id = message.mentions.members.size > 0 ? message.mentions.users.first().id : undefined || args[0] || message.author.id

    // Hacemos un fetch del usuario
    client.users.fetch(id).then(async us => {
      const avatar = await us.displayAvatarURL({ dynamic: true, size: 1024 }) // Avatar del usuario en cualquier formato dado por Discord

      // Función para obtener el avatar con extensión
      function getAvatarWithExtension(extension) {
        return us.displayAvatarURL({ extension: extension, size: 512 })
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

      const avatarglobal = new Discord.EmbedBuilder()
        .setAuthor({ name: us.username, iconURL: avatar })
        .setDescription(`▸ 📷 Formatos\n> [WEBP](${getAvatarWithExtension("webp")}) | [PNG](${getAvatarWithExtension("png")}) | [JPG](${getAvatarWithExtension("jpg")}) | [JPEG](${getAvatarWithExtension("jpeg")}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2])}\n> RGB: ${dominantColor}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
        .setColor(dominantColor)
        .setImage(avatar)
      return message.reply({ embeds: [avatarglobal] })
    }).catch(e => console.error(e))
  }
}