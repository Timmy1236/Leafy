const fs = require("fs");
const Discord = require("discord.js");

module.exports = client => {
  try {
    client.commands = new Discord.Collection();
    const table = [];

    fs.readdirSync("./commands/message").forEach((carpeta) => {
      const archivos = fs
        .readdirSync(`./commands/message/${carpeta}/`)
        .filter((f) => f.endsWith(".js"));

      for (const archivo of archivos) {
        const comando = require(`../commands/message/${carpeta}/${archivo}`);
        client.commands.set(comando.nombre, comando);

        const nombreArchivo = archivo.replace(/\.js$/, "");
        table.push({
          Categoría: carpeta,
          Comando: nombreArchivo,
          Estado: "LISTO!",
        });
      }
    });

    console.table(table);

  } catch (error) {
    console.log(`\x1b[0;31mbot/loaders/commands>\x1b[0m Error!`);
    console.error(error);
  }
};
