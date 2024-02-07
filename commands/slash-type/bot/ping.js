const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Devuelve la latencia de Leafy"),
  categoria: "Bot",
  async run(client, interaction) {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

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

    // Obtenemos la latencia del bot restando el tiempo en que se creo el mensaje y el tiempo en que se creo la interaccion
    const messagePing = reply.createdTimestamp - interaction.createdTimestamp;

    // Obtenemos la latencia del cliente
    const ClientPing = await Math.round(client.ws.ping);

    const pingEmbed = new Discord.EmbedBuilder()
      .setTitle(`🏓 | Pong`)
      .setColor(client.color)
      .setDescription(`🤖 **Bot**: *${messagePing}ms* ${pingeValues(messagePing)}\n📡 **WebSocket**: *${ClientPing}ms* ${pingeValues(ClientPing)}`)
      .setThumbnail("https://media.tenor.com/xyQ5VZ1CIM8AAAAi/network-connection.gif")

    return interaction.editReply({ embeds: [pingEmbed] });
  }
}