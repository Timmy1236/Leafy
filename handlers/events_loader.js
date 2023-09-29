const fs = require("fs");
const ascii = require("ascii-table");
const gradient = require('gradient-string');

let table = new ascii("Eventos");
table.setHeading("Eventos", "Estado");

module.exports = client => {
  const events = fs.readdirSync("./events/").filter((file) => file.endsWith(".js"));
  for (var file of events) {
    let fileContents = require(`../events/${file}`); // Requerimos el archivo para obtener su información.
    let fileName = file.substring(0, file.length - 3); // Eliminamos el ".js" de los archivos para que la lista tenga un mejor aspecto.

    client.on(fileName, fileContents.bind(null, client)); // Agregamos el evento al cliente.

    table.addRow(fileName, "LISTO!"); // Añadimos el archivo a la tabla.
  }
  console.log(gradient.teen(table.toString()));
}