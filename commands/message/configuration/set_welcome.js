const alertBox = require("../../../utils/alertBox.js");
module.exports = {
  nombre: "setwelcome",
  alias: ["setWelcomeChannel", "setwelcome", "set-welcome-channel", "setwc"],
  descripcion: "Establece el canal de bienvenida para el servidor.",
  categoria: "⚙️ Configuración",
  ejemplos: ["setwelcome status", "setwelcome #bienvenida", "setwelcome clear"],
  run: async (Discord, client, message, args, userDB, serverDB) => {
    const embed = new Discord.EmbedBuilder()
      .setColor(client.color)
      .setTitle("⚙️ | Configuración del Canal de Bienvenida")
      .setDescription("Usa este comando para establecer un canal donde se enviarán los mensajes de bienvenida a los nuevos miembros del servidor.\n\n" +
        "**Ejemplos:**\n" +
        "Ver el estado del canal de bienvenida: `setwelcome status`\n" +
        "Añadir un canal de bienvenida: `setwelcome #bienvenida`\n" +
        "Eliminar el canal de bienvenida: `setwelcome clear`"
      );

    if (!args[0]) return message.reply({ embeds: [embed] });

    // Avisaremos al usuario si el servidor cuenta o no con un canal de bienvenida ya establecida.
    if (args[0].toLowerCase() === "status") {
      if (!serverDB.welcomeChannel) {
        return message.reply({ embeds: [alertBox.createAlertBox("info", "El servidor no cuenta con ningún canal de bienvenida.")] });
      }

      const channel = message.guild.channels.cache.get(serverDB.welcomeChannel);
      return message.reply({ embeds: [alertBox.createAlertBox("info", `El canal de bienvenida actual es: ${channel}`)] });
    }

    if (args[0].toLowerCase() === "clear") {
      if (!serverDB.welcomeChannel) {
        return message.reply({ embeds: [alertBox.createAlertBox("warning", "No se puede eliminar el canal de bienvenida porque este servidor no cuenta con una establecida.")] });
      }

      const oldChannel = message.guild.channels.cache.get(serverDB.welcomeChannel);

      serverDB.welcomeChannel = null;
      await serverDB.save();

      return message.reply({ embeds: [alertBox.createAlertBox("info", `El canal: ${oldChannel} dejara de ser el canal de bienvenida.`)] });
    }

    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

    if (!channel) return message.reply({ embeds: [alertBox.createAlertBox("error", "Canal no encontrado. Asegúrate de mencionar un canal válido.")] });
    if (channel.type !== 0) return message.reply({ embeds: [alertBox.createAlertBox("error", "Por favor, selecciona un canal de texto.")] });

    serverDB.welcomeChannel = channel.id;
    await serverDB.save();

    return message.reply({ embeds: [alertBox.createAlertBox("info", `Canal de bienvenida establecido en: ${channel}`)] });
  }
}