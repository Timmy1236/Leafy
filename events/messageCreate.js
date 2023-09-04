module.exports = async (client, message) => {
  if (message.author.bot) return;

  const Discord = require("discord.js");
  const config = require('../config.json')

  client.color = config.BOT.EMBED_COLOR;
  client.ownerID = config.OWNER_ID;
  client.prefix = config.BOT.PREFIX;

  const mencion = new Discord.EmbedBuilder()
    .setColor(client.color)
    .setAuthor({ name: `👋 ${message.author.username}` })
    .setDescription(`Mi prefix es: **${client.prefix}**\nPara ver mis comandos usa: **${client.prefix}help**`);

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) return message.reply({ embeds: [mencion] });

  if (!message.content.startsWith(client.prefix)) return;

  let args = message.content.slice(client.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  let cmd = client.cmd.get(command) || client.cmd.find((c) => c.alias.includes(command));

  if (cmd) return cmd.run(Discord, client, message, args);
}