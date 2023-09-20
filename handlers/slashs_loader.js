const fs = require("fs");
const Discord = require("discord.js");
const ascii = require("ascii-table");
const gradient = require('gradient-string');

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
let commandsArray = [];

let table = new ascii("Slash");
table.setHeading("Categoría", "Slash", "Estado");

module.exports = client => {
  const token = client.token
  const clientID = client.clientID

  try {
    client.slashcommands = new Discord.Collection(); // Creamos una colección para almacenar los comandos slash.

    // Primero cargaremos los slash commands en el bot.
    fs.readdirSync("./commands/slash-type").forEach((folder) => {
      let comando = fs.readdirSync(`./commands/slash-type/${folder}/`).filter((f) => f.endsWith(".js"));

      for (var commands of comando) {
        let comandos = require(`../commands/slash-type/${folder}/${commands}`); // Requerimos el archivo para obtener su información.
        client.slashcommands.set(comandos.nombre, comandos); // Agregamos el comando a la colección de comandos slash.

        let fileName = commands.substring(0, commands.length - 3); // Eliminamos el ".js" de los archivos para que la lista tenga un mejor aspecto.
        table.addRow(folder, fileName, "LISTO!"); // Añadimos el archivo a la tabla.
      }
      /*
        Después tendremos que subir los slash commands a la API de Discord.
        Código sacado de: https://github.com/Mendo6472/Demi-Bot/blob/main/src/slashloader.js B)
      */
      for (const commands of comando) {
        const slash = require(`../commands/slash-type/${folder}/${commands}`)
        commandsArray.push(slash.data.toJSON())
        //console.log("Comando '" + slash.data.name + "' cargado...")
      }
      const rest = new REST({ version: "10" }).setToken(token);
      createSlash()
      async function createSlash() {
        try {
          await rest.put(Routes.applicationCommands(clientID), { body: commandsArray })
          //console.log("Comandos Slash Cargados...")
        } catch (error) {
          console.error(error)
        }
      }
    });
    console.log(gradient.mind(table.toString()));
  } catch (error) {
    console.log(gradient('orange', 'red')('Bot> Error!'));
    console.error(error);
  }
}