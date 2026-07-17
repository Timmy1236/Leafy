import extractColorFromImage from "../../utils/extractColor.js";
import { boolToSpanish, formatDateLong } from "../../utils/general.js";
import { SlashCommandBuilder, EmbedBuilder, ChannelType } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Muestra información detallada del servidor."),
	categoria: "🌐 Discord",
	run: async (client, interaction): Promise<void> => {
		await interaction.deferReply();
		const server = interaction.guild;
		if (!server) return;

		// Miembros
		const memberCount = server.members.cache.filter(m => !m.user.bot).size;
		const totalMembers = server.members.cache.size;
		const botCount = totalMembers - memberCount;
		const getMemberCountByStatus = (status: string) => server.members.cache.filter(m => m.presence?.status === status).size;

		// Canales
		const getChannelCountByType = (type: ChannelType) => server.channels.cache.filter(c => c.type === type).size;

		// Emojis
		const emojis: string[] = [];
		const emojisAnimated: string[] = [];
		server.emojis.cache.filter(e => !e.animated).forEach(e => emojis.push(`<:${e.name}:${e.id}>`));
		server.emojis.cache.filter(e => e.animated).forEach(e => emojisAnimated.push(`<a:${e.name}:${e.id}>`));

		const emojiEstaticos
			= emojis.length > 10
				? `${emojis.slice(0, 10).join(" | ")} y **${emojis.length - 10}** más...`
				: emojis.join(" | ");

		const emojiAnimados
			= emojisAnimated.length > 10
				? `${emojisAnimated.slice(0, 10).join(" | ")} y **${emojisAnimated.length - 10}** más...`
				: emojisAnimated.join(" | ");

		// Owner
		const Owner = await server.fetchOwner();

		// Roles
		const roles = server.roles.cache
			.filter(r => r.id !== server.id && !r.managed)
			.sort((a, b) => b.position - a.position)
			.map(r => r.toString());

		const roleList
			= roles.length > 7
				? `${roles.slice(0, 7).join(" | ")} y **${roles.length - 7 + 1}** más...`
				: roles.join(" | ");

		// Color del icono
		const { dominantColor } = await extractColorFromImage(server.iconURL({ size: 1024, extension: "png" })!);

		// Nivel de verificación del servidor
		const verificationLevels = {
			0: "Ninguno - *Todos pueden entrar.*",
			1: "Bajo - *Debe tener una dirección de correo electrónico verificada en su cuenta.*",
			2: "Medio - *Su cuenta debe de estar registrado en Discord por más de 5 minutos.*",
			3: "Alto - *Su cuenta debe ser mas antiguo de 5 minutos registrados y estar en el servidor por mas de 10 minutos.*",
			4: "Muy *alto - Debes de tener un numero de teléfono verificado en su cuenta.*"
		};
		const guildVerification = verificationLevels[server.verificationLevel] ?? "Desconocido";

		const embed = new EmbedBuilder()
			.setColor(dominantColor)
			.setThumbnail(server.iconURL({ size: 1024 }))
			.setAuthor({ name: `${server.name} (${server.id})` })
			.setDescription(server.description ? server.description : "Sin descripción.")
			.addFields({
				name: "▸ 📃 Información",
				value:
          `>>> **Owner:** <@!${Owner.user.id}>\n`
          + `**Verificado:** ${boolToSpanish(server.verified)}\n`
          + `**Seguridad:** ${guildVerification}\n`
          + `**Creación:** ${formatDateLong(server.createdAt)}`
			})
			.addFields({
				name: "▸ 💬 Canales",
				value:
          `>>> 📁 **Categorías**: ${getChannelCountByType(ChannelType.GuildCategory)}\n`
          + `💬 **Texto**: ${getChannelCountByType(ChannelType.GuildText)}\n`
          + `🔊 **Voz**: ${getChannelCountByType(ChannelType.GuildVoice)}\n`
          + `🗞️ **Noticias**: ${getChannelCountByType(ChannelType.GuildAnnouncement)}\n`
          + `🧵 **Hilos**: ${getChannelCountByType(ChannelType.GuildForum)}`,
				inline: true
			})
			.addFields({
				name: "▸ 👥 Miembros",
				value:
          `>>> 👤 **Usuarios**: ${memberCount}\n`
          + `🤖 **Bots**: ${botCount}\n`
          + `🟢 **Conectados**: ${getMemberCountByStatus("online")}\n`
          + `🟡 **Ausentes**: ${getMemberCountByStatus("idle")}\n`
          + `🔴 **No molestar**: ${getMemberCountByStatus("dnd")}\n`
          + `⚫ **Desconectados**: ${getMemberCountByStatus("offline")}`,
				inline: true
			})
			.addFields({
				name: "▸ 🎖 Roles",
				value: `>>> ${roleList || "Sin roles."}`
			})
			.addFields({
				name: "▸ 😀 Emojis",
				value: `>>> ${emojiEstaticos || "Sin emojis."}`
			})
			.addFields({
				name: "▸ 😎 Emojis animados",
				value: `>>> ${emojiAnimados || "Sin emojis animados."}`
			});

		await interaction.editReply({ embeds: [embed] });
	}
};

export default command;