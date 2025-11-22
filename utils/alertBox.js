const Discord = require("discord.js");
const emojis = require("./emojis.js");

function createAlertBox(type, description) {

  switch (type) {
    case 'error':
      const errorEmbed = new Discord.EmbedBuilder()
        .setColor("#FF0000")
        .setDescription(`${emojis.error} ${description}`)
      return errorEmbed;
    case 'warning':
      const warningEmbed = new Discord.EmbedBuilder()
        .setColor("#FFA500")
        .setDescription(`${emojis.warning} ${description}`)
      return warningEmbed;
    case 'info':
    default:
      const infoEmbed = new Discord.EmbedBuilder()
        .setColor("#FFFFFF")
        .setDescription(`${emojis.info} ${description}`)
      return infoEmbed;
  }
}

module.exports = { createAlertBox };
