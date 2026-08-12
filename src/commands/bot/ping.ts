import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Devuelve la latencia de Leafy"),
  categoria: "🤖 Bot",
  run: async (client, interaction): Promise<void> => {
    await interaction.deferReply();

    const reply = await interaction.fetchReply();

    const pingeValues = (ping: number, { high = 500, medium = 300 } = {}) =>
      ping > high ? "🔴" : ping > medium ? "🟡" : "🟢";

    const messagePing = reply.createdTimestamp - interaction.createdTimestamp;
    const clientPing = Math.round(client.ws.ping);

    const pingEmbed = new EmbedBuilder()
      .setTitle("🏓 | Pong")
      .setColor(client.color)
      .setDescription(
        `🤖 **Bot**: *${messagePing}ms* ${pingeValues(messagePing)}\n`
        + `📡 **WebSocket**: *${clientPing}ms* ${pingeValues(clientPing)}`
      )
      .setThumbnail("https://media.tenor.com/xyQ5VZ1CIM8AAAAi/network-connection.gif");

    await interaction.editReply({ embeds: [pingEmbed] });
  }
};

export default command;
