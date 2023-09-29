const Discord = require("discord.js");
const gradient = require("gradient-string");
const fs = require("fs");
console.log(gradient.fruit("Bot> Iniciando..."));

// Verificamos primero si el archivo config.json existe
if (!fs.existsSync("./config.json")) {
  console.error(gradient('orange', 'red')("Bot> Error!\nEl archivo config.json no existe. Por favor, sigue los pasos del readme."));
  process.exit(1); // Detenemos el bot.
}

// Si existe el archivo config.json, podemos continuar.
const { AntiCrash } = require("./src/anti-crash.js");
const config = require("./config.json");

// Creamos el cliente.
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Discord.Partials.Channel],
  allowedMentions: { parse: [] },
});

// Guardamos los emojis personalizados en el cliente.
const emoji = require("./src/emojis.js");
client.emoji = emoji;

// Guardando variables en el client, para poder usarlo después en los comandos.
client.color = config.BOT.EMBED_COLOR;
client.ownerID = config.OWNER_ID;
client.prefix = config.BOT.PREFIX;
client.changelogUrl = config.CHANGELOG_URL;
client.clientID = config.CLIENT_ID

// Un script; Cargara todos los handlers que se encuentren dentro de la carpeta.
require("./src/handlers-loader.js")(client)

// Un script; Imprime en la consola el error que ocurrió, a su vez dejando el bot encendido.
AntiCrash();

client.login(config.TOKEN).catch((err) => {
  console.log(gradient('orange', 'red')('Bot> Error!'));
  console.error(err);
});