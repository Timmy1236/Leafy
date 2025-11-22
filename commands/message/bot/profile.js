const xpUtils = require("../../../utils/xp.js")
module.exports = {
  nombre: "profile",
  alias: [""],
  descripcion: "",
  categoria: "🤖 Bot",
  run: async (Discord, client, message, args, userDB, serverDB) => {
    const embed = new Discord.EmbedBuilder()
      .setColor(client.color)
      .setTitle(message.author.username)
      .setThumbnail(message.author.avatarURL())
      .addFields({ name: 'XP:', value: `${userDB.xp}/${await xpUtils.getUserXPNeeded(userDB)}`, inline: true })
      .addFields({ name: 'Level:', value: `${userDB.level}`, inline: true })
      .addFields({ name: 'Contador de comandos:', value: `${userDB.commandsCount}` })
    message.reply({ embeds: [embed] });
  }
};