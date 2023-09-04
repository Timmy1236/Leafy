const fs = require("fs");
const gradient = require("gradient-string");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { TOKEN } = require("./config.json");
const commands = []
const path = require('path');
const foldersPath = path.join(__dirname, 'commands/slash-type/')
const commandFolders = fs.readdirSync(foldersPath);

console.log(gradient.fruit("Bot> Cargando los comandos slash, espere..."));
for (const file of commandFolders) {
  const filePath = path.join(foldersPath, file);
  console.log(filePath)
  try {
    const command = require(filePath);
    commands.push(command.data.toJSON());
  } catch (e) {
    console.error(e);
  }
}

const rest = new REST({ version: "10" }).setToken(TOKEN);
(async () => {
  try {
    const data = await rest.put(
      Routes.applicationCommands("1146467716039966730"), // @Timmy1236 TODO: Poder agarrar una variable que guarde la id del cliente en vez de usar una string.
      { body: commands },
    );
    console.log(gradient.fruit("Bot> Slash cargados."));
  } catch (error) {
    console.error(error);
  }
})();