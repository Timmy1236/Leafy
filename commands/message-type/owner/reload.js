const { glob } = require('glob');
module.exports = {
  nombre: "reload",
  alias: ["clearcache", "cr", "restart"],
  descripcion: "Limpia la cache de los comandos, obligando a que se reinicien.",
  categoria: "👑 Owner",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    if (message.author.id !== client.ownerID) return message.reply({ content: "No puedes usar este comando!" })
    if (!args[0]) return message.reply({ content: "Necesitas pasarme un comando" })

    try {
      async function findFile(file) {
        const jsfiles = await glob(`**/${file}.js`, { ignore: 'node_modules/**' })
        return jsfiles
      }

      findFile(args[0]).then((result) => {
        if (!result[0]) {
          message.reply({ content: `No se encontró ningún comando llamado: \`${args[0].toUpperCase()}\`` })
        } else {
          const str = result[0]
          const filepath = str.replace(/^.*\\(commands|message-type)\\/, '');

          if (result[0] == undefined) return message.reply({ content: 'No se encontro nada.' })

          try {
            delete require.cache[require.resolve("../" + filepath)]
            const commands = require("../" + filepath);
            client.cmd.set(commands.nombre, commands)
          } catch (e) {
            return message.reply({ content: `El comando: \`${args[0].toUpperCase()}\` no fue recargado | Error: ` + e })
          }

          return message.reply({ content: `El comando \`${args[0].toUpperCase()}\` acaba de ser recargado` })
        }
      })
    } catch (e) {
      return message.reply({ content: `El comando: \`${args[0].toUpperCase()}\` no fue recargado | Error: ` + e })
    }
  }
}