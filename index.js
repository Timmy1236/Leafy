const Discord = require("discord.js");
const fs = require("fs");

const emojis = require("./utils/emojis.js");
const loader = require("./loaders/loader.js");

async function initializeBot() {
  console.log("\x1b[0;92mbot/index.js>\x1b[0m Iniciando...");

  if (!fs.existsSync("./config.json")) {
    console.log("\x1b[0;31mbot/index.js>\x1b[0m Error!\nEl archivo config.json no existe. Por favor, crea uno siguiendo el ejemplo: config_example.json.");
    process.exit(1);
  }

  const config = require("./config.json");

  // Creamos el cliente Discord
  const client = new Discord.Client({
    intents: [Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildPresences, Discord.GatewayIntentBits.GuildMessageReactions],
    partials: [Discord.Partials.Channel],
    allowedMentions: { parse: [] },
  });

  client.botEmojis = emojis; // No puede ser client.emojis porque: https://discord.com/developers/docs/resources/emoji >:[
  client.color = config.BOT.EMBED_COLOR;
  client.ownerID = config.OWNER_ID;
  client.prefix = config.BOT.PREFIX;
  client.clientID = config.CLIENT_ID;

  console.log("\x1b[0;92mbot/index.js>\x1b[0m Ejecutando: loader.js");
  loader(client);

  client.login(config.TOKEN).catch((err) => {
    console.log(`\x1b[0;31mbot/index.js>\x1b[0m Error!`);
    console.error(err);
  });
}

console.time("Tiempo de carga");
initializeBot();