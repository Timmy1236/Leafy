const Discord = require("discord.js")

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("purge")
    .setDescription("Elimina una cantidad de mensajes del canal actual")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
    .setContexts(Discord.InteractionContextType.Guild)
    .addIntegerOption(option => option.setName('cantidad').setDescription('La cantidad de mensajes que quieras borrar').setMinValue(1).setMaxValue(100).setRequired(true)),
  categoria: "🛡️ Moderación",
  permisos: ["MANAGE_MESSAGES"],
  async run(client, interaction) {
    try {
      const { options } = interaction;
      const cantidad = options.getInteger("cantidad")

      // Botón de confirmación
      const row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('purge_confirm')
          .setLabel('Confirmar')
          .setStyle(Discord.ButtonStyle.Success)
      );

      // Mensaje de confirmación
      await interaction.reply({
        content: `¿Estás seguro de que quieres eliminar **${cantidad}** mensajes de este canal?`,
        components: [row],
        ephemeral: true
      });

      // Esperar la interacción del botón
      const filter = i => i.customId === 'purge_confirm' && i.user.id === interaction.user.id;
      const confirmation = await interaction.channel.awaitMessageComponent({ filter, time: 15000 }).catch(() => null);

      if (!confirmation) {
        await interaction.editReply({ content: "⏰ | No se recibió confirmación. Operación cancelada.", components: [] });
        return;
      }

      // Borrar mensajes
      await interaction.channel.bulkDelete(cantidad);

      // Notificar éxito
      const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setDescription(`🗑️ | ${cantidad} mensajes han sido eliminados de este canal.`);

      await confirmation.update({ embeds: [embed], content: null, components: [] });
    } catch (error) {
      await interaction.reply({ content: `『 Acaba de ocurrir un error al ejecutar el comando 』`, flags: Discord.MessageFlags.Ephemeral });
      console.error(error)
    }
  }
}