const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("informe")
    .setDescription("Reporta un bug o envía una idea para mejorar al bot"),

  /*
    @Timmy1236
    TODO: Poder crear en el slash, una opción multiple que se pueda elegir entre informar un bug, reporte o una idea, al elegir cada opción se cree un modal diferente.
  */

  run: async (client, interaction) => {
    const modal = new Discord.ModalBuilder()
      .setCustomId('crearReporte')
      .setTitle('Informar / Reportar');

    const title = new Discord.TextInputBuilder()
      .setCustomId('title')
      .setLabel("Cual sera el titulo del informe?")
      .setStyle(Discord.TextInputStyle.Short);

    const description = new Discord.TextInputBuilder()
      .setCustomId('description')
      .setLabel("Cual sera la descripción?")
      .setStyle(Discord.TextInputStyle.Paragraph);

    const firstActionRow = new Discord.ActionRowBuilder().addComponents(title);
    const secondActionRow = new Discord.ActionRowBuilder().addComponents(description);

    modal.addComponents(firstActionRow, secondActionRow);

    await interaction.showModal(modal);
  }
}