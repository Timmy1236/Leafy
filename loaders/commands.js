const Discord = require("discord.js");
const fs = require("fs");
const path = require('path');
const logTable = [];

module.exports = client => {
  try {
    client.commands = new Discord.Collection();
    const folderPath = path.join(__dirname, "..", "commands", "message"); // Ruta: Leafy/commands/message

    fs.readdirSync(folderPath).forEach((folder) => {
      const categorysPath = path.join(folderPath, folder) // Categorías, Ej: bot, configuration, discord, owner
      const commands = fs.readdirSync(categorysPath).filter((f) => f.endsWith(".js")); // Los comandos por categorías, Ej: discord: avatar.js, rolinfo.js, server.js

      for (const command of commands) {
        const commandsPath = path.join(categorysPath, command) // La ruta de un comando
        const commandLoaded = require(commandsPath);
        client.commands.set(commandLoaded.nombre, commandLoaded);

        logTable.push({ Categoría: folder, Comando: commandLoaded.nombre, Estado: "CARGADO" });
      }
    });
    console.table(logTable);
  } catch (error) {
    console.log(`\x1b[0;31mbot/loaders/commands>\x1b[0m Error!`);
    console.error(error);
  }
};
