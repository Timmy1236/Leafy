import { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Quita el baneo a un usuario del servidor.")
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild)
		.addStringOption(option => option.setName("usuarioid").setDescription("El usuario que deseas desbanear.").setRequired(true)) as SlashCommandBuilder,
	categoria: "🛡️ Moderación",
	permisos: ["BAN_MEMBERS"],
	run: async (client, interaction): Promise<void> => {
		const { options } = interaction;
		const userID = options.getString("usuarioid");

		if (!interaction.inCachedGuild()) {
			await interaction.reply({ content: "Este comando solo funciona en servidores.", ephemeral: true });
			return;
		}

		if (!userID) {
			await interaction.reply({ content: `${client.botEmojis.error} 『 Debes proporcionar la ID del usuario que deseas desbanear. 』`, ephemeral: true });
			return;
		}

		function isValidSnowflake(id: string): boolean {
			const snowflakeRegex = /^[0-9]{17,19}$/;
			return snowflakeRegex.test(id);
		}

		try {
			await interaction.deferReply();
			if (isValidSnowflake(userID)) {
				await interaction.guild.members.unban(userID);

				const unbanEmbed = new EmbedBuilder()
					.setTitle("🩹 | Desban")
					.setDescription("Un usuario acaba de ser desbaneado en este servidor.")
					.addFields({ name: "▸ 👤 Usuario", value: `>>> **ID:** ${userID}` })
					.setColor(client.color)
					.setTimestamp();

				await interaction.editReply({ embeds: [unbanEmbed] });
			}
			else {
				await interaction.editReply({ content: `${client.botEmojis.error} 『 La ID del usuario no es valida 』` });
			}
		}
		catch (error) {
			await interaction.editReply({ content: `${client.botEmojis.warning} 『 Acaba de ocurrir un error al intentar desbanear este usuario. 』` });
			console.error(error);
		}
	}
};

export default command;