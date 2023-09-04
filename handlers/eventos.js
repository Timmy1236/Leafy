const fs = require("fs");
const Discord = require("discord.js");
const path = require("path");
const ascii = require("ascii-table");
const gradient = require('gradient-string');
let table2 = new ascii("Eventos");
table2.setHeading("Eventos", "Estado");

module.exports = client => {
  const events = fs.readdirSync("./events/").filter((file) => file.endsWith(".js"));
  for (var file of events) {
    let fileContents = require(`../events/${file}`);
    let fileName = file.substring(0, file.length - 3);
    const slash = require(`../events/${file}`);
    client.on(fileName, fileContents.bind(null, client));
    table2.addRow(fileName, "LISTO!");
  }
  console.log(gradient.teen(table2.toString()));
}