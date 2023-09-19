const fs = require("fs");
const Discord = require("discord.js");
const ascii = require("ascii-table");
const gradient = require('gradient-string');

let table = new ascii("Slash");
table.setHeading("Categoría", "Slash", "Estado");

module.exports = client => {
  try {
    client.slashcommands = new Discord.Collection(); // Creamos una colección para almacenar los comandos.

    fs.readdirSync("./commands/slash-type").forEach((folder) => {
      let comando = fs.readdirSync(`./commands/slash-type/${folder}/`).filter((f) => f.endsWith(".js"));

      for (var commands of comando) {
        let comandos = require(`../commands/slash-type/${folder}/${commands}`); // Requerimos el archivo para obtener su información.
        client.slashcommands.set(comandos.nombre, comandos); // Agregamos el comando a la colección de comandos.

        let fileName = commands.substring(0, commands.length - 3); // Eliminamos el ".js" de los archivos para que la lista tenga un mejor aspecto.
        table.addRow(folder, fileName, "LISTO!");
      }
    });
    console.log(gradient.mind(table.toString()));
  } catch (error) {
    console.log(gradient('orange', 'red')('Bot> Error!'));
    console.error(error);
  }
}