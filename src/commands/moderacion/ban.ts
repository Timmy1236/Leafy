import { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Banea a un usuario del servidor.")
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.setContexts(InteractionContextType.Guild)
		.addUserOption(option => option.setName("usuario").setDescription("El usuario que deseas banear.").setRequired(true))
		.addStringOption(option => option.setName("motivo").setDescription("¿Cual es la razón del ban?")) as SlashCommandBuilder,
	categoria: "🛡️ Moderación",
	permisos: ["BAN_MEMBERS"],
	run: async (client, interaction): Promise<void> => {
		const { options, guild } = interaction;
		const user = options.getUser("usuario", true);
		const reason = options.getString("motivo") || "Ningún motivo dado.";

		if (!interaction.inCachedGuild()) {
			await interaction.reply({ content: "Este comando solo funciona en servidores.", ephemeral: true });
			return;
		}

		const targetMember = await guild!.members.fetch(user.id).catch(() => null);

		if (!targetMember) { // NOTE: ALERTBOX
			return;
		}

		await interaction.deferReply();

		// Creamos un embed por si ocurre un error.
		const errorEmbed = new EmbedBuilder() // NOTE: ALERTBOX
			.setTitle("❌ | Error")
			.setColor(client.color);

		// Si el usuario que desea banear tiene un rol superior al del usuario que ejecuto el comando.
		if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
			errorEmbed.setDescription("No puedes banear a ese usuario porque tiene el mismo o un rol superior al tuyo.");
			await interaction.editReply({ embeds: [errorEmbed] });
			return;
		}

		// Si el usuario que desea banear tiene un rol superior al del bot.
		if (targetMember.roles.highest.position >= interaction.guild.members.me!.roles.highest.position) {
			errorEmbed.setDescription("No puedo banear a ese usuario porque tiene el mismo o un rol superior al mio.");
			await interaction.editReply({ embeds: [errorEmbed] });
			return;
		}

		// Si el usuario que desea banear sea el propio bot.
		if (user.id === client.user!.id) {
			errorEmbed.setDescription("No me puedo banearme.");
			await interaction.editReply({ embeds: [errorEmbed] });
			return;
		}

		try {
			// Baneamos al usuario
			await targetMember.ban({ reason });

			const banEmbed = new EmbedBuilder()
				.setTitle("🔨 | Ban")
				.setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
				.setDescription("Un usuario acaba de ser baneado en este servidor.")
				.addFields({ name: "▸ 👤 Usuario", value: `>>> **Username:** ${user.username}\n**ID:** ${user.id}` })
				.addFields({ name: "▸ 📄 Razón", value: `>>> \`${reason}\`` })
				.setColor(client.color)
				.setTimestamp();

			await interaction.editReply({ embeds: [banEmbed] });
		}
		catch (error) {
			await interaction.editReply({ content: `${client.botEmojis.warning} 『 Acaba de ocurrir un error al intentar banear a este usuario 』` });
			console.error(error);
		}
	}
};

export default command;