const User = require("../db/models/user.js");
const Server = require("../db/models/server.js");
const XP = require("../utils/xp.js");

module.exports = async (client, message) => {
  const Discord = require("discord.js");

  if (message.author.bot) return;
  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) return message.reply({ content: `Hey ${message.author}, mi prefix en este servidor es: **${client.prefix}**` });
  if (!message.content.startsWith(client.prefix)) return;

  const [userDB] = await User.findOrCreate({ where: { id: message.author.id } });
  const [serverDB] = await Server.findOrCreate({ where: { id: message.guild.id } });

  let args = message.content.slice(client.prefix.length).trim().split(/ +/g); // args: Es un array que contiene los argumentos del mensaje junto al comando. Ej: t!help arg1 arg2 = ["arg1", "arg2"]
  let command = args.shift().toLowerCase(); // command: Es una variable que contiene el "comando" del mensaje enviado por el usuario. Ej: t!help = "help"
  let cmd = client.commands.get(command) || client.commands.find((c) => c.alias.includes(command)); // cmd: Se buscara en la colección de comandos del bot un comando con ese nombre o con su alias, si se encuentra, se guardara en ella el comando para después ejecutarlo.

  if (cmd) {
    await message.channel.sendTyping();

    if (cmd.categoria == "👑 Owner" && message.author.id !== client.ownerID) return message.reply({ content: "No puedes usar este comando." })

    userDB.increment('commandsCount');
    XP.giveUserXP(message.author.id);

    return cmd.run(Discord, client, message, args, userDB, serverDB);
  }
}