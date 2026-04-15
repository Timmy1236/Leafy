import extractColorFromImage from '../../utils/extractColor.js';
import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

type image = "webp" | "png" | "jpg" | "jpeg" | "gif";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Obtén el avatar de un usuario que menciones"),
  categoria: "🌐 Discord",
  run: async (client, interaction): Promise<void> => {
    const user = interaction.options.getUser('usuario');
    if (!user) return;

    const avatar = user.displayAvatarURL({ size: 1024 })

    // Función para obtener el avatar con una extensión específica
    function _getAvatarWithExtension(extension: image) {
      return user!.displayAvatarURL({ extension: extension, size: 512 })
    }

    const { dominantColor, stringRgb, hex } = await extractColorFromImage(_getAvatarWithExtension("png"));

    const avatarEmbed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: avatar })
      .setDescription(`▸ 📷 Formatos\n> [WEBP](${_getAvatarWithExtension("webp")}) | [PNG](${_getAvatarWithExtension("png")}) | [JPG](${_getAvatarWithExtension("jpg")}) | [JPEG](${_getAvatarWithExtension("jpeg")}) \n\n▸ 🖌️ Color Dominante\n> HEX: ${hex}\n> RGB: ${stringRgb}\n\n▸ 📎 Fuentes\n>>> [Buscar en Google](https://lens.google.com/uploadbyurl?url=${avatar})\n[Buscar en Yandex](https://yandex.com/images/search?url=${avatar}&rpt=imageview)\n[Buscar en SauceNAO](https://saucenao.com/search.php?url=${avatar})`)
      .setColor(dominantColor)
      .setImage(avatar)
    interaction.reply({ embeds: [avatarEmbed] })
  }
}

export default command;