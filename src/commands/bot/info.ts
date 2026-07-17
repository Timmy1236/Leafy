import { execSync } from "node:child_process";
import packagejson from "../../../package.json" with { type: "json" };
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, version } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName("info")
		.setDescription("Información sobre el bot."),
	categoria: "⚙️ Configuración",
	run: async (client, interaction): Promise<void> => {
		try {
			const uptime = client.uptime;

			if (!uptime) return; // NOTE: what?

			// Formateamos el tiempo de actividad del bot
			const days = Math.floor(uptime / (1000 * 60 * 60 * 24));
			const hours = Math.floor((uptime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
			const activity = `${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;

			// Obtenemos la version del NPM
			const npmVersion = execSync("npm -v").toString().trim();

			const userSize = client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b).toLocaleString();
			const serverSize = client.guilds.cache.size.toLocaleString();
			const channelSize = client.channels.cache.size.toLocaleString();

			const githubButton = new ButtonBuilder()
				.setLabel("GitHub")
				.setURL("https://github.com/Timmy1236/Leafy")
				.setStyle(ButtonStyle.Link);

			const row = new ActionRowBuilder<ButtonBuilder>()
				.addComponents(githubButton);

			if (!client.user) return;

			const botEmbed = new EmbedBuilder()
				.setAuthor({ name: client.user.username || "Bot", iconURL: client.user.avatarURL() || undefined })
				.setDescription(packagejson.description)
				.setColor(client.color)
				.addFields({ name: "▸ 💻 Info", value: `>>> **Lenguaje:** JavaScript\n**Discord.js:** v${version}\n**Node.js:** ${process.version}\n**NPM:** ${npmVersion}`, inline: true })
				.addFields({ name: "▸ 📈 Stats", value: `>>> **Uptime:** ${activity}\n**Usuarios:** ${userSize}\n**Servers:** ${serverSize}\n**Canales:** ${channelSize}`, inline: true });
			await interaction.reply({ embeds: [botEmbed], components: [row] });
		}
		catch (error) {
			await interaction.reply({ content: `${client.botEmojis.warning} 『 **Acaba de ocurrir un error al intentar ejecutar el comando, inténtalo mas tarde.** 』` });
			console.error(error);
		}
	}
};

export default command;