import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, InteractionContextType, PermissionFlagsBits, ButtonStyle, MessageFlags, ButtonInteraction, ComponentType } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Elimina una cantidad de mensajes del canal actual")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setContexts(InteractionContextType.Guild)
		.addIntegerOption(option => option.setName("cantidad").setDescription("La cantidad de mensajes que quieras borrar").setMinValue(1).setMaxValue(100).setRequired(true)) as SlashCommandBuilder,
	categoria: "🛡️ Moderación",
	permisos: ["MANAGE_MESSAGES"],
	run: async (client, interaction): Promise<void> => {
		try {
			const { options } = interaction;
			const cantidad = options.getInteger("cantidad", true);

			// Botón de confirmación
			const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId("purge_confirm")
					.setLabel("Confirmar")
					.setStyle(ButtonStyle.Success)
			);

			// Mensaje de confirmación
			await interaction.reply({
				content: `¿Estás seguro de que quieres eliminar **${cantidad}** mensajes de este canal?`,
				components: [row],
				ephemeral: true
			});

			if (!interaction.inGuild() || !interaction.channel) {
				await interaction.reply({ content: "Este comando solo funciona en servidores.", ephemeral: true });
				return;
			}

			// Esperar la interacción del botón
			const filter = (i: ButtonInteraction) => i.customId === "purge_confirm" && i.user.id === interaction.user.id;
			const confirmation = await interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 15000 }).catch(() => null);

			if (!confirmation) {
				await interaction.editReply({ content: "⏰ | No se recibió confirmación. Operación cancelada.", components: [] });
				return;
			}

			// Borrar mensajes
			await interaction.channel.bulkDelete(cantidad);

			// Notificar éxito
			const embed = new EmbedBuilder()
				.setColor(client.color)
				.setDescription(`🗑️ | ${cantidad} mensajes han sido eliminados de este canal.`);

			await confirmation.update({ embeds: [embed], content: null, components: [] });
		}
		catch (error) {
			await interaction.reply({ content: "『 Acaba de ocurrir un error al ejecutar el comando 』", flags: MessageFlags.Ephemeral });
			console.error(error);
		}
	}
};

export default command;