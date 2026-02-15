const Discord = require("discord.js");
const fs = require("fs");
const path = require('path');
const logTable = [];

module.exports = client => {
  try {
    client.slashCommands = new Discord.Collection();
    const folderPath = path.join(__dirname, "..", "commands", "slash"); // Ruta: Leafy/commands/slash

    fs.readdirSync(folderPath).forEach(folder => {
      const categorysPath = path.join(folderPath, folder) // Categorías, Ej: bot, configuration, discord, owner
      const slashs = fs.readdirSync(categorysPath).filter(f => f.endsWith(".js"));

      for (const slash of slashs) {
        const slashPath = path.join(categorysPath, slash)
        const slashLoaded = require(slashPath);
        client.slashCommands.set(slashLoaded.data.name, slashLoaded);

        logTable.push({ Comando: slashLoaded.data.name, Estado: "CARGADO" });
      }
    });
    console.table(logTable);
  } catch (error) {
    console.log(`\x1b[0;31mbot/loaders/slash.js>\x1b[0m Error!`);
    console.error(error);
  }
};
