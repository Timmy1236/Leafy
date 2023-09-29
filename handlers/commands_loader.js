const fs = require("fs");
const Discord = require("discord.js");
const ascii = require("ascii-table");
const gradient = require('gradient-string');

let table = new ascii("Comandos");
table.setHeading("Categoría", "Comando", "Estado");

module.exports = client => {
  try {
    client.cmd = new Discord.Collection(); // Creamos una colección para almacenar los comandos.

    fs.readdirSync("./commands/message-type").forEach((file) => {
      let comando = fs.readdirSync(`./commands/message-type/${file}/`).filter((f) => f.endsWith(".js"));

      for (var modu of comando) {
        let comandos = require(`../commands/message-type/${file}/${modu}`); // Requerimos el archivo para obtener su información.
        client.cmd.set(comandos.nombre, comandos); // Agregamos el comando a la colección de comandos.

        let fileName = modu.substring(0, modu.length - 3); // Eliminamos el ".js" de los archivos para que la lista tenga un mejor aspecto.
        table.addRow(file, fileName, "LISTO!"); // Añadimos el archivo a la tabla.
      }
    });
    console.log(gradient.mind(table.toString()));
  } catch (error) {
    console.log(gradient('orange', 'red')('Bot> Error!'));
    console.error(error);
  }
}