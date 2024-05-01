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
    if (!mensaje) return message.reply({ content: `${client.emoji.warning} 『 **El mensaje no puede estar vació** 』` });

    // Si el mensaje tiene más de 2000 caracteres
    if (mensaje.length > 2000) return message.reply({ content: `${client.emoji.warning} 『 **El mensaje no puede tener más de 2000 caracteres** 』` });

    // Si el mensaje tiene un @everyone, @here o un rol aleatorio
    if (mensaje.includes("@everyone") || mensaje.includes("@here") || mensaje.includes("<@&")) return message.reply({ content: `${client.emoji.warning} 『 **El mensaje no puede contener una menciones a los roles** 』` });

    // Si todo esta correcto, borraremos el mensaje enviado por el usuario para despues enviar el mensaje que el bot debe decir
    message.delete();

    // Enviamos el mensaje
    return message.channel.send({ content: mensaje });
  }
}