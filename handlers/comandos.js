const fs = require("fs");
const Discord = require("discord.js");
const path = require("path");
const ascii = require("ascii-table");
const gradient = require('gradient-string');
const array = require('../src/commandslist.js');
let table = new ascii("Comandos");
table.setHeading("Categoría", "Comando", "Estado");

module.exports = client => {
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
}