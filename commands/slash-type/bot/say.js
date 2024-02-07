const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("say")
    .setDescription("Escriba un mensaje que quieras para que Leafy lo diga")
    .addStringOption(option => option
      .setName('mensaje')
      .setDescription('Cual es el mensaje que quieres que Leafy lo repita')
      .setRequired(true)
    ),
  categoria: "Bot",
  async run(client, interaction) {

    // Obtenemos el mensaje que el usuario quiere que el bot diga
    const mensaje = interaction.options.getString("mensaje");

    // Si el mensaje no tiene nada
    if (!mensaje) return interaction.reply({ content: `❌ | Debes de escribir un mensaje.` });

    // Si el mensaje tiene más de 2000 caracteres
    if (mensaje.length > 2000) return interaction.reply({ content: `❌ | El mensaje no puede tener más de 2000 caracteres.` });

    // Si el mensaje tiene un @everyone o @here
    if (mensaje.includes("@everyone") || mensaje.includes("@here")) return interaction.reply({ content: `❌ | No puedes mencionar a "everyone" o "here".` });

    // Si el mensaje tiene un rol
    if (mensaje.includes("<@&")) return interaction.reply({ content: `❌ | No puedes mencionar roles.` });

    // Si todo esta correcto, enviaremos el mensaje que el bot debe decir
    return interaction.reply({ content: mensaje });
  }
}