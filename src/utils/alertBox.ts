import { EmbedBuilder } from "discord.js";
import emojis from "./emojis.js";

function createAlertBox(type: string, description: string) {
	switch (type) {
		case "error": {
			const errorEmbed = new EmbedBuilder().setColor("#FF0000").setDescription(`${emojis.error} ${description}`);
			return errorEmbed;
		}
		case "warning": {
			const warningEmbed = new EmbedBuilder()
				.setColor("#FFA500")
				.setDescription(`${emojis.warning} ${description}`);
			return warningEmbed;
		}
		case "info":
		default: {
			const infoEmbed = new EmbedBuilder()
				.setColor("#FFFFFF")
				.setDescription(`${emojis.info} ${description}`);
			return infoEmbed;
		}
	}
}

export default { createAlertBox };