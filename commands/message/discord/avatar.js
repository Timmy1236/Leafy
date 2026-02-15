const { extractColorFromImage } = require('../../../utils/extractColor.js');
const { isValidSnowflake } = require('../../../utils/general.js')

module.exports = {
  nombre: "avatar",
  alias: ["pfp"],
  descripcion: "Muestra el avatar de alguien o el tuyo con su color dominante y en diferentes formatos.",
  categoria: "🌐 Discord",
  run: async (Discord, client, message, args, _userDB, _serverDB) => {
    // Obtenemos el ID del usuario mencionado, si no hay menciones, usamos el ID del autor del mensaje o el primer argumento.
    let id = message.mentions.members.size > 0 ? message.mentions.users.first().id : args[0] || message.author.id

    // Hacemos un fetch del usuario
    if (isValidSnowflake(id)) {
      client.users.fetch(id).then(async us => {
        const avatar = await us.displayAvatarURL({ dynamic: true, size: 1024 })

        // Función para obtener el avatar con una extensión específica
        function getAvatarWithExtension(extension) {
          return us.displayAvatarURL({ extension: extension, size: 512 })
        }

        const { dominantColor, stringRgb, hex } = await extractColorFromImage(getAvatarWithExtension("png"));

        const avatarglobal = new Discord.EmbedBuilder()
          .setAuthor({ name: us.username, iconURL: avatar })
          .setDescription(`▸ 📷 Formatos\n> [WEBP](${getAvatarWithExtension("webp")}) | [PNG](${getAvatarWithExtension("png")}) | [JPG](${getAvatarWithExtension("jpg")}) | [JPEG](${getAvatarWithExtension("jpeg")}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${hex}\n> RGB: ${stringRgb}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
          .setColor(dominantColor)
          .setImage(avatar)
        return message.reply({ embeds: [avatarglobal] })
      }).catch(e => console.error(e))
    } else {
      return message.reply({ content: `${client.botEmojis.error} 『 Ese usuario no existe. 』` })
    }
  }
}