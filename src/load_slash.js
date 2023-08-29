const Discord = require("discord.js");
const fs = require("fs");
const gradient = require("gradient-string");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { CLIENT_ID, TOKEN } = require("../../config.json");
const commands = []
const slashComandos = fs.readdirSync("./src/commands/slash-type/").filter(file => file.endsWith(".js"))

console.log(gradient.fruit("Bot> Cargando los comandos slash, espere..."));

for (const file of slashComandos) {
  const slash = require(`../commands/slash-type/${file}`)
  commands.push(slash.data.toJSON())
}

const rest = new REST({ version: "10" }).setToken(TOKEN);
createSlash()

async function createSlash() {
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID), {
      body: commands
    }
    )
    console.log(gradient.fruit("Bot> Slash cargados, ahora prueba iniciando el bot."));
  } catch (e) {
    console.log(gradient('orange', 'red')('Bot> Error!'));
    console.error(e)
  }
}