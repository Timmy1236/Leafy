module.exports = {
  nombre: "say",
  alias: ["decir"],
  descripcion: "Escriba un mensaje que quieras para que Leafy lo diga",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping()

    // Obtenemos el mensaje que el usuario quiere que el bot diga
    const mensaje = args.slice(0).join(" ");

    // Si el mensaje no tiene nada
    if (!mensaje) return message.reply({ content: `❌ | Debes de escribir un mensaje.` });

    // Si el mensaje tiene más de 2000 caracteres
    if (mensaje.length > 2000) return message.reply({ content: `❌ | El mensaje no puede tener más de 2000 caracteres.` });

    // Si el mensaje tiene un @everyone o @here
    if (mensaje.includes("@everyone") || mensaje.includes("@here")) return message.reply({ content: `❌ | No puedes mencionar a "everyone" o "here".` });

    // Si el mensaje tiene un rol
    if (mensaje.includes("<@&")) return message.reply({ content: `❌ | No puedes mencionar roles.` });

    // Si todo esta correcto, borraremos el mensaje enviado por el usuario para despues enviar el mensaje que el bot debe decir
    message.delete();

    // Enviamos el mensaje
    return message.channel.send({ content: mensaje });
  }
}