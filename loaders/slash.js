const fs = require("fs");
const Discord = require("discord.js");

module.exports = client => {
  try {
    client.slashCommands = new Discord.Collection();
    const table = [];

    fs.readdirSync("./commands/slash").forEach(folder => {
      const files = fs.readdirSync(`./commands/slash/${folder}`)
        .filter(f => f.endsWith(".js"));

      for (const file of files) {
        const slash = require(`../commands/slash/${folder}/${file}`);

        client.slashCommands.set(slash.data.name, slash);

        table.push({
          Comando: file.replace(".js", ""),
          Estado: "LISTO!"
        });
      }
    });

    console.table(table);
  } catch (error) {
    console.log(`\x1b[0;31mbot/loaders/slash.js>\x1b[0m Error!`);
    console.error(error);
  }
};
