import { GatewayIntentBits, Partials } from "discord.js";
import { LeafyClient } from "./types/Client.js";
import emojis from "./utils/emojis.js";
import loader from "./loaders/loader.js";
import config from "./config.json" with { type: "json" };

async function initializeBot() {
	console.log("\x1b[0;92mbot/index.js>\x1b[0m Iniciando...");
	// Creamos el cliente Discord
	const client = new LeafyClient(
		{
			intents: [
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildPresences,
				GatewayIntentBits.GuildMessageReactions
			],
			partials: [Partials.Channel]
		},
		{
			color: config.BOT.EMBED_COLOR as `#${string}`,
			clientID: config.CLIENT_ID,
			ownerID: config.OWNER_ID,
			emojis: emojis
		}
	);

	console.log("\x1b[0;92mbot/index.js>\x1b[0m Ejecutando: loader.js");
	await loader(client);

	client.login(config.TOKEN).catch((err) => {
		console.log("\x1b[0;31mbot/index.js>\x1b[0m Error!");
		console.error(err);
	});
}

console.time("Tiempo de carga");
await initializeBot();