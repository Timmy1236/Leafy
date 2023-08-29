const Discord = require("discord.js");
const array = require("../../src/commandslist.js");
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtén los comandos de Leafy Boy!")
    .addStringOption(option => option
      .setName('option')
      .setDescription('Categoría de comandos')
      .setRequired(false)
      .addChoices(
        { name: 'Slash', value: 'slash' },
      ),
    ),
  async run(client, interaction) {
    switch (interaction.options.getString("option")) {
      case "slash":
        const helpSlash = new Discord.EmbedBuilder()
          .setColor("#fca32b")
          .setTitle('📙 | Slash')
          .setThumbnail(client.user.avatarURL())
          .addFields({ name: '▸ 📎 Slash', value: `>>> ${array.arraySlash.join(' | ')}` })
        interaction.reply({ embeds: [helpSlash] })
        break;

      default:
        const help = new Discord.EmbedBuilder()
          .setColor("#fca32b")
          .setTitle('📙 | Comandos')
          .setDescription(`${array.totalCommands()} Comandos en total.\n${array.arraySlash.length} Comandos slash en total.`)
          .setThumbnail(client.user.avatarURL())
          .addFields({ name: `▸ <:Discord:1146184569373073510> Discord (${array.arrayDiscord.length})`, value: `>>> ${array.arrayDiscord.join(' | ')}` })
          .addFields({ name: `▸ 🤖 Bot (${array.arrayBot.length})`, value: `>>> ${array.arrayBot.join(' | ')}` })
        interaction.reply({ embeds: [help] })
        break;
    }
  }
}