import alertBox from "../../utils/alertBox.js";
import { SlashCommandBuilder, EmbedBuilder, ChannelType } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";
import { saveServer } from "../../db/server.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("setwelcome")
    .setDescription("Establece o gestiona el canal de bienvenida del servidor.")
    .addSubcommand(subcommand =>
      subcommand
        .setName("status")
        .setDescription("Ver el canal de bienvenida actual.")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("clear")
        .setDescription("Eliminar el canal de bienvenida configurado.")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("set")
        .setDescription("Establecer un canal de bienvenida.")
        .addChannelOption(option =>
          option
            .setName("canal")
            .setDescription("Canal donde se enviarán las bienvenidas.")
            .setRequired(true)
        )
    ) as SlashCommandBuilder,
  categoria: "⚙️ Configuración",
  run: async (client, interaction, _userDB, _serverDB): Promise<void> => {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (!_userDB || !_serverDB || !guild) return;

    // Embeds base
    const baseEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle("⚙️ | Configuración del Canal de Bienvenida")
      .setDescription(
        "Usa este comando para configurar o consultar el canal de bienvenida.\n\n" +
        "**Subcomandos:**\n" +
        "`/setwelcome status` → Ver canal actual.\n" +
        "`/setwelcome set canal:#bienvenida` → Establecer canal.\n" +
        "`/setwelcome clear` → Eliminar canal configurado."
      );

    // Si no hay subcomando válido
    if (!subcommand) {
      await interaction.reply({ embeds: [baseEmbed], ephemeral: true });
      return;
    }

    // --- STATUS ---
    if (subcommand === "status") {
      if (!_serverDB.welcomeChannel) {
        await interaction.reply({ embeds: [alertBox.createAlertBox("info", "El servidor no cuenta con ningún canal de bienvenida configurado.")], ephemeral: true });
        return;
      }

      const channel = guild.channels.cache.get(_serverDB.welcomeChannel);
      if (!channel) {
        await interaction.reply({ embeds: [alertBox.createAlertBox("warning", "El canal configurado ya no existe en este servidor.")], ephemeral: true });
        return;
      }

      await interaction.reply({ embeds: [alertBox.createAlertBox("info", `El canal de bienvenida actual es: ${channel}`)] });
      return;
    }

    // --- CLEAR ---
    if (subcommand === "clear") {
      if (!_serverDB.welcomeChannel) {
        await interaction.reply({ embeds: [alertBox.createAlertBox("warning", "No se puede eliminar el canal de bienvenida porque no hay ninguno configurado.")], ephemeral: true });
        return;
      }

      const oldChannel = guild.channels.cache.get(_serverDB.welcomeChannel);

      _serverDB.welcomeChannel = null;
      saveServer(_serverDB);

      await interaction.reply({ embeds: [alertBox.createAlertBox("info", `El canal ${oldChannel ? oldChannel : "`(eliminado)`"} dejó de ser el canal de bienvenida.`)] });
      return;
    }

    // --- SET ---
    if (subcommand === "set") {
      const channel = interaction.options.getChannel("canal");

      if (!channel) {
        await interaction.reply({ embeds: [alertBox.createAlertBox("error", "Canal no encontrado. Asegúrate de seleccionar un canal válido.")], ephemeral: true });
        return;
      }
      // Solo permitir canales de texto
      if (channel.type !== ChannelType.GuildText) {
        await interaction.reply({ embeds: [alertBox.createAlertBox("error", "Por favor, selecciona un canal de texto.")], ephemeral: true });
        return;
      }

      _serverDB.welcomeChannel = channel.id;
      saveServer(_serverDB);

      await interaction.reply({ embeds: [alertBox.createAlertBox("info", `✅ Canal de bienvenida establecido en: ${channel}`)] });
      return;
    }
  }
};

export default command;