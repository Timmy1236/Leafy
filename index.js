console.clear()
const gradient = require("gradient-string");
console.log(gradient.fruit("Bot> Iniciando..."));
const Discord = require("discord.js");
const { Loader } = require("./src/loader.js");
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
Loader(client);
client.login(config.TOKEN).catch((err) => {
  console.log(gradient('orange', 'red')('Bot> Error!'));
  console.error(gradient('red')(err));
});