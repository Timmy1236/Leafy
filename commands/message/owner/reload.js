const { glob } = require('node:fs/promises');
module.exports = {
  nombre: "reload",
  alias: ["clearcache", "cr", "restart"],
  descripcion: "Reinicia los comandos para que se apliquen los últimos cambios.",
  categoria: "👑 Owner",
  run: async (Discord, client, message, args, userDB, serverDB) => {
    if (!args[0]) return message.reply({ content: "Necesitas pasarme un comando" })

    async function findFile(file) {
      const jsfiles = [];

      for await (const path of glob(`commands/message/*/${file}.js`)) {
        jsfiles.push(path);
      }

      return jsfiles;
    }


    findFile(args[0]).then((result) => {
      if (!result[0]) {
        return message.reply({ content: `No se encontró ningún comando llamado: \`${args[0].toUpperCase()}\`` })
      }

      try {
        const str = result[0]
        const path = require('path');
        const absolutePath = path.resolve(str);

        delete require.cache[absolutePath]

        const commands = require(absolutePath);

        if (!commands || !commands.nombre) {
          return message.reply({ content: `El archivo encontrado no es un comando válido: \`${str}\`` })
        }

        client.commands.set(commands.nombre, commands)

        message.reply({ content: `Comando \`${commands.nombre}\` recargado exitosamente!` })
      } catch (error) {
        console.error('Error al recargar comando:', error)
        message.reply({ content: `Error al recargar el comando: ${error.message}` })
      }
    }).catch((error) => {
      console.error('Error en findFile:', error)
      message.reply({ content: `Error al buscar el archivo: ${error.message}` })
    })
  }
}