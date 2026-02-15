module.exports = {
  nombre: "ping",
  alias: ["latencia"],
  descripcion: "Pong!",
  categoria: "🤖 Bot",
  run: async (Discord, client, message, _args, _userDB, _serverDB) => {
    const pingeValues = (ping, { high = 500, medium = 300 } = {}) =>
      ping > high ? '🔴' : ping > medium ? '🟡' : '🟢';

    const msg = await message.reply('📡 Calculando...')
    const messagePing = msg.createdTimestamp - message.createdTimestamp
    const ClientPing = await Math.round(client.ws.ping);

    const pingEmbed = new Discord.EmbedBuilder()
      .setTitle(`🏓 | Pong`)
      .setColor(client.color)
      .setDescription(`🤖 **Bot**: *${messagePing}ms* ${pingeValues(messagePing)}\n📡 **WebSocket**: *${ClientPing}ms* ${pingeValues(ClientPing)}`)
      .setThumbnail("https://media.tenor.com/xyQ5VZ1CIM8AAAAi/network-connection.gif")
    message.channel.messages.fetch(messagePing.id).then(message => message.delete());
    return message.reply({ embeds: [pingEmbed] })
  }
};