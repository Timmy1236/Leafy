module.exports = {
  nombre: "invite",
  alias: ["invitar"],
  descripcion: "Invita al bot a tus servidores.",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    message.channel.sendTyping()
    const inviteEmbed = new Discord.EmbedBuilder()
      .setTitle(`Invítame!`)
      .setThumbnail(bot.botAvatar)
      .addFields({ name: "▸ 🤖 General", value: `> [Link](https://discord.com/oauth2/authorize?client_id=${bot.botId}&scope=bot&permissions=414465248449) \nInvita al bot con permisos suficientes para la mayoría de comandos.` })
      .addFields({ name: "▸ 🏅 Admin", value: `> [Link](https://discord.com/oauth2/authorize?client_id=${bot.botId}&scope=bot&permissions=8) \nInvita al bot con permiso de administrador, **esto no es del todo recomendado.**` })
      .setColor(bot.embedColor)

    return message.reply({ embeds: [inviteEmbed] });
  }
}