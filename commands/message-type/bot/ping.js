module.exports = {
  nombre: "ping",
  alias: ["latencia"],
  descripcion: "Pong!",
  categoria: "🤖 Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    message.channel.sendTyping();
    let pingeValues = function (ping, options) {
      let values = {
        "high": 350,
        "medium": 150,
        "low": 50
      }
      values = {
        ...values,
        ...options
      }
      if (ping > values.high) {
        return '🔴'
      } else if (ping > values.medium) {
        return '🟡'
      } else {
        return '🟢'
      }
    }

    const msg = await message.reply('📡 Calculando...')

    const editingLatency = msg.createdTimestamp - message.createdTimestamp
    let ping = await Math.round(client.ws.ping);

    const pingEmbed = new Discord.EmbedBuilder()
      .setColor(bot.embedColor)
      .setDescription(`📶 **Ping**: *${editingLatency}ms* ${pingeValues(editingLatency)}\n📡 **WebSocket**: *${ping}ms* ${pingeValues(ping)}`)
    message.channel.messages.fetch(editingLatency.id).then(message => message.delete());
    return message.reply({ embeds: [pingEmbed] })
  }
};