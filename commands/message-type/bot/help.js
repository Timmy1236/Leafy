const array = require('../../../src/commandslist.js');
module.exports = {
  nombre: "help",
  alias: ["comando"],
  descripcion: "Obtén una lista de todos los comandos disponibles.",
  categoria: "🤖 Bot",
  tieneHelp: 1,
  run: async (Discord, client, message, prefix, args, bot) => {
    await message.channel.sendTyping()
    switch (args[0] ? args[0].toLowerCase() : undefined) {
      case "slash":
        const helpSlash = new Discord.EmbedBuilder()
          .setColor("#fca32b")
          .setTitle('📙 | Slash')
          .setThumbnail(bot.botAvatar)
          .addFields({ name: '▸ 📎 Slash', value: `>>> ${array.arraySlash.join(' | ')}` })
        message.reply({ embeds: [helpSlash] })
        break;

      default:
        const help = new Discord.EmbedBuilder()
          .setColor(bot.embedColor)
          .setTitle('📙 | Comandos')
          .setThumbnail(bot.botAvatar)
          .setDescription(`📓 **Sub-Helps**: ${prefix}help slash\n${array.totalCommands()} Comandos en total.\n${array.arraySlash.length} Comandos slash en total.`)
          .addFields({ name: `▸ <:Discord:1146184569373073510> Discord (${array.arrayDiscord.length})`, value: `>>> ${array.arrayDiscord.join(' | ')}` })
          .addFields({ name: `▸ 🤖 Bot (${array.arrayBot.length})`, value: `>>> ${array.arrayBot.join(' | ')}` })
        message.reply({ embeds: [help] })
        break;
    }
  }
}