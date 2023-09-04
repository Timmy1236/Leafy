const gradient = require("gradient-string");
console.log(gradient.fruit("Bot> Iniciando..."));

const Discord = require("discord.js");
const { AntiCrash } = require("./src/anti-crash.js");
const config = require("./config.json");

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

// Para cargar los scripts que se encuentren dentro de la carpeta de "handlers"
require("./src/handlers-loader.js")(client)

// Un script que imprime en la consola el error que ocurrió, a su vez dejando el bot encendido.
AntiCrash();

client.login(config.TOKEN).catch((err) => {
  console.log(gradient('orange', 'red')('Bot> Error!'));
  console.error(gradient('red')(err));
});