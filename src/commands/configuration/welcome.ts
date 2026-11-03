import { SlashCommandBuilder, EmbedBuilder, ChannelType, MessageFlags, InteractionContextType, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";
import { saveServer } from "../../db/server.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("welcome")
    .setDescription("Establece o gestiona el canal de bienvenida del servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts(InteractionContextType.Guild)
    .addSubcommand(subcommand => subcommand.setName("help").setDescription("Muestra información importante que hace este comando."))
    .addSubcommand(subcommand => subcommand.setName("status").setDescription("Ver el canal de bienvenida actual."))
    .addSubcommand(subcommand => subcommand.setName("clear").setDescription("Eliminar el canal de bienvenida configurado."))
    .addSubcommand(subcommand => subcommand.setName("set").setDescription("Establecer un canal de bienvenida.").addChannelOption(option => option.setName("canal").setDescription("Canal donde se enviarán las bienvenidas.").setRequired(true))),
  categoria: "Configuración",
  run: async (client, interaction, _userDB, _serverDB): Promise<void> => {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (!_userDB || !_serverDB || !guild) return;

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle("⚙️ | Configuración del Canal de Bienvenida")
      .setDescription(
        "Usa este comando para configurar o consultar el canal de bienvenida.\n\n"
        + "**Subcomandos:**\n"
        + "`/welcome status` → Ver canal actual.\n"
        + "`/welcome set canal:#bienvenida` → Establecer canal.\n"
        + "`/welcome clear` → Eliminar canal configurado."
      );

    // HELP
    if (subcommand === "help") {
      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    // STATUS
    if (subcommand === "status") {
      if (!_serverDB.welcomeChannel) {
        await interaction.reply({ content: "El servidor no cuenta con ningún canal de bienvenida configurado. Configura uno ahora con: /welcome set", flags: MessageFlags.Ephemeral });
        return;
      }

      const channel = guild.channels.cache.get(_serverDB.welcomeChannel);
      if (!channel) {
        await interaction.reply({ content: "⚠️ ¿Huh? Este servidor ya cuenta con un canal de bienvenidas, pero no tengo acceso a ella actualmente. Verifica que no haya sido borrado o perdí acceso a ella.", flags: MessageFlags.Ephemeral });
        return;
      }

      await interaction.reply({ content: `El canal de bienvenida actual es: ${String(channel)}` });
      return;
    }

    // CLEAR
    if (subcommand === "clear") {
      if (!_serverDB.welcomeChannel) {
        await interaction.reply({ content: "❔ No hay un canal de bienvenida configurado actualmente.", flags: MessageFlags.Ephemeral });
        return;
      }

      const oldChannel = guild.channels.cache.get(_serverDB.welcomeChannel);

      _serverDB.welcomeChannel = null;
      saveServer(_serverDB);

      await interaction.reply({ content: `El canal ${oldChannel ? String(oldChannel) : "`(eliminado)`"} dejó de ser el canal de bienvenida.` });
      return;
    }

    // SET
    if (subcommand === "set") {
      const channel = interaction.options.getChannel("canal");

      if (!channel) {
        await interaction.reply({ content: "Canal no encontrado. Asegúrate de seleccionar un canal válido.", flags: MessageFlags.Ephemeral });
        return;
      }

      if (channel.type !== ChannelType.GuildText) {
        await interaction.reply({ content: "Por favor, selecciona un canal de texto.", flags: MessageFlags.Ephemeral });
        return;
      }

      _serverDB.welcomeChannel = channel.id;
      saveServer(_serverDB);

      await interaction.reply({ content: `✅ Canal de bienvenida establecido en: <#${channel.id}> ` });
      return;
    }
  }
};

export default command;
