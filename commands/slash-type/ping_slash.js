const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Testeando slash commands!"),
  async run(client, interaction) {
    return interaction.reply({ content: "Pong!" })
  }
}