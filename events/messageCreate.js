module.exports = async (client, message) => {
  if (message.author.bot) return;

  const Discord = require("discord.js");
  const config = require('../config.json')

  class bot {
    static embedColor = config.BOT.EMBED_COLOR;
    static prefix = config.BOT.PREFIX;
    static ownerID = config.OWNER_ID;
    static botAvatar = client.user.avatarURL()
    static botName = client.user.username;
    static botId = client.user.id;
  }

  const prefix = bot.prefix

  const mencion = new Discord.EmbedBuilder()
    .setColor(bot.embedColor)
    .setAuthor({ name: `👋 ${message.author.username}` })
    .setDescription(`Mi prefix es: **${prefix}**\nPara ver mis comandos usa: **${prefix}help**`);

  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`)))
    return message.reply({ embeds: [mencion] });

  if (!message.content.startsWith(prefix)) return;

  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  let cmd = client.cmd.get(command) || client.cmd.find((c) => c.alias.includes(command));

  if (cmd) return cmd.run(Discord, client, message, prefix, args, bot);
}