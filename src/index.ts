import { GatewayIntentBits, Partials } from "discord.js";
import { LeafyClient } from "./types/Client.js";
import emojis from "./utils/emojis.js";
import loader from "./loaders/loader.js";
import config from "./config.json" with { type: "json" };
import { cLog } from "./utils/cLog.js";

async function initializeBot() {
  cLog("INFO", "Inicializando el bot...");

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

  await loader(client);

  client.login(config.TOKEN).catch((e) => {
    cLog("ERROR", "Error critico al intentar hacer login!", e);
  });
}

console.time("Tiempo de carga");
await initializeBot();
