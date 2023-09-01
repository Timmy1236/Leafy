const fs = require("fs");
const Discord = require("discord.js");
const path = require("path");
const ascii = require("ascii-table");
const gradient = require('gradient-string');
const array = require('./commandslist.js');
const filePath = path.join(__dirname, '../config.json');

if (!fs.existsSync(filePath)) {
  console.log(gradient('orange', 'red')('Bot> Error!'));
  console.log(gradient('orange', 'red')('Bot> El bot no puede iniciar porque no se encontró el archivo: "config.json".'));
  process.exit(1)
}

let table = new ascii("Comandos");
table.setHeading("Categoría", "Comando", "Estado");
let table2 = new ascii("Eventos");
table2.setHeading("Eventos", "Estado");
let table3 = new ascii("Slashs");
table3.setHeading("SlashCommand", "Estado");

function Loader(client) {
  console.log(gradient.fruit("Bot> Cargando comandos, espere..."))
  client.cmd = new Discord.Collection();
  fs.readdirSync("./commands/message-type").forEach((file) => {
    if (fs.lstatSync(path.resolve("./commands/message-type", file)).isDirectory()) { }
    let comando = fs
      .readdirSync(`./commands/message-type/${file}/`)
      .filter((f) => f.endsWith(".js"));
    for (var modu of comando) {
      let fileName = modu.substring(0, modu.length - 3);
      let comandos = require(`../commands/message-type/${file}/${modu}`);
      client.cmd.set(comandos.nombre, comandos);
      if (comandos.nombre) {
        table.addRow(file, fileName, "LISTO!");
        switch (file) {
          case "bot":
            array.pushToBot(fileName);
            break;
          case "discord":
            array.pushToDiscord(fileName);
            break;
          case "owner":
            break;
          default:
            table.addRow(file, fileName, "NO CATEGORY");
            break;
        }
      }
    }
  });
  console.log(gradient.mind(table.toString()));

  const events = fs.readdirSync("./events/").filter((file) => file.endsWith(".js"));
  for (var file of events) {
    let fileContents = require(`../events/${file}`);
    let fileName = file.substring(0, file.length - 3);
    const slash = require(`../events/${file}`);
    client.on(fileName, fileContents.bind(null, client));
    table2.addRow(fileName, "LISTO!");
  }
  console.log(gradient.teen(table2.toString()));

  client.slashcommands = new Discord.Collection();
  const slashComandos = fs
    .readdirSync("./commands/slash-type")
    .filter((file) => file.endsWith(".js"));
  for (const file of slashComandos) {
    let fileName = file.substring(0, file.length - 3);
    const slash = require(`../commands/slash-type/${file}`);
    table3.addRow(fileName, "LISTO!");
    array.pushToSlash(fileName);
    client.slashcommands.set(slash.data.name, slash);
  }
  console.log(gradient.morning(table3.toString()));

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand) return;
    const slashComs = client.slashcommands.get(interaction.commandName);
    if (!slashComs) return;
    try {
      await slashComs.run(client, interaction);
    } catch (e) {
      console.log(e);
    }
  });
}
module.exports = {
  Loader,
};