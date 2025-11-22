const Discord = require("discord.js");
const alertBox = require("../../../utils/alertBox.js");

module.exports = {
  data: new Discord.SlashCommandBuilder()
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
    ),

  categoria: "⚙️ Configuración",

  async run(client, interaction, userDB, serverDB) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    // Embeds base
    const baseEmbed = new Discord.EmbedBuilder()
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
    if (!subcommand)
      return interaction.reply({ embeds: [baseEmbed], ephemeral: true });

    // --- STATUS ---
    if (subcommand === "status") {
      if (!serverDB.welcomeChannel) {
        return interaction.reply({
          embeds: [
            alertBox.createAlertBox(
              "info",
              "El servidor no cuenta con ningún canal de bienvenida configurado."
            )
          ],
          ephemeral: true
        });
      }

      const channel = guild.channels.cache.get(serverDB.welcomeChannel);
      if (!channel) {
        return interaction.reply({
          embeds: [
            alertBox.createAlertBox(
              "warning",
              "El canal configurado ya no existe en este servidor."
            )
          ],
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          alertBox.createAlertBox(
            "info",
            `El canal de bienvenida actual es: ${channel}`
          )
        ]
      });
    }

    // --- CLEAR ---
    if (subcommand === "clear") {
      if (!serverDB.welcomeChannel) {
        return interaction.reply({
          embeds: [
            alertBox.createAlertBox(
              "warning",
              "No se puede eliminar el canal de bienvenida porque no hay ninguno configurado."
            )
          ],
          ephemeral: true
        });
      }

      const oldChannel = guild.channels.cache.get(serverDB.welcomeChannel);

      serverDB.welcomeChannel = null;
      await serverDB.save();

      return interaction.reply({
        embeds: [
          alertBox.createAlertBox(
            "info",
            `El canal ${oldChannel ? oldChannel : "`(eliminado)`"} dejó de ser el canal de bienvenida.`
          )
        ]
      });
    }

    // --- SET ---
    if (subcommand === "set") {
      const channel = interaction.options.getChannel("canal");

      if (!channel)
        return interaction.reply({
          embeds: [
            alertBox.createAlertBox(
              "error",
              "Canal no encontrado. Asegúrate de seleccionar un canal válido."
            )
          ],
          ephemeral: true
        });

      // Solo permitir canales de texto
      if (channel.type !== Discord.ChannelType.GuildText) {
        return interaction.reply({
          embeds: [
            alertBox.createAlertBox(
              "error",
              "Por favor, selecciona un canal de texto."
            )
          ],
          ephemeral: true
        });
      }

      serverDB.welcomeChannel = channel.id;
      await serverDB.save();

      return interaction.reply({
        embeds: [
          alertBox.createAlertBox(
            "info",
            `✅ Canal de bienvenida establecido en: ${channel}`
          )
        ]
      });
    }
  }
};
