module.exports = async (client, message) => {
  if (message.author.bot) return; // Si el mensaje es de un bot, simplemente lo ignoramos.

  const Discord = require("discord.js"); // Requerimos la librería de discord.js

  // Creamos un embed que se enviara cuando un usuario mencione al bot
  const mencion = new Discord.EmbedBuilder()
    .setColor(client.color)
    .setAuthor({ name: `👋 ${message.author.username}` })
    .setDescription(`Mi prefix es: **${client.prefix}**\nPara ver mis comandos usa: **${client.prefix}help**`);

  // Si el mensaje solamente contiene una mención del bot, se enviara el embed mención.
  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) return message.reply({ embeds: [mencion] });

  // Si el mensaje no empieza con el prefix del bot, simplemente lo ignoramos.
  if (!message.content.startsWith(client.prefix)) return;

  let args = message.content.slice(client.prefix.length).trim().split(/ +/g); // Obtenemos los argumentos del mensaje enviados por el usuario
  let command = args.shift().toLowerCase(); // Obtenemos el "comando" del mensaje enviado por el usuario
  let cmd = client.cmd.get(command) || client.cmd.find((c) => c.alias.includes(command)); // Con el "comando" obtenido del mensaje, intentaremos buscarlo en la colección de comandos

  if (cmd) return cmd.run(Discord, client, message, args); // Si el comando existe, ejecutamos el archivo del comando con los argumentos y el mensaje
}