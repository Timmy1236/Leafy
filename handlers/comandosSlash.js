const fs = require("fs");
const Discord = require("discord.js");
const path = require("path");
const ascii = require("ascii-table");
const gradient = require('gradient-string');
const array = require('../src/commandslist.js');
let table3 = new ascii("Slashs");
table3.setHeading("SlashCommand", "Estado");

module.exports = client => {
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
}