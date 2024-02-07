module.exports = {
  nombre: "ping",
  alias: ["latencia"],
  descripcion: "Pong!",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping();

    // Función donde le pasamos el ping y nos devolverá un emoji dependiendo de la latencia
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

    // Creamos un mensaje que nos servirá para calcular el ping
    const msg = await message.reply('📡 Calculando...')

    // Usando el mensaje anterior, calculamos la latencia del bot restando el tiempo en que se creo el mensaje y el tiempo en que se creo el mensaje de la interacción
    const messagePing = msg.createdTimestamp - message.createdTimestamp

    // Obtenemos la latencia del cliente
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