module.exports = {
  nombre: "invite",
  alias: ["invitar"],
  descripcion: "Invita al bot a tus servidores.",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping()
    const inviteEmbed = new Discord.EmbedBuilder()
      .setTitle(`Invítame!`)
      .setThumbnail(client.user.avatarURL())
      .addFields({ name: "▸ 📎 Link", value: `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8` })
      .setColor(client.color)

    return message.reply({ embeds: [inviteEmbed] });
  }
}