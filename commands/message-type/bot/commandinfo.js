const { glob } = require('glob');

module.exports = {
  nombre: "commandinfo",
  alias: ["cmdinfo", "comandoinfo", "comando-info", "cmd-info"],
  descripcion: "Obtén información de los comandos message-type, sobre su función, como usarlo, etc.",
  categoria: "Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {

    try {
      // Esta función busca el archivo del comando usando glob (https://www.npmjs.com/package/glob)
      async function findFile(file) {
        const jsfiles = await glob(`**/${file}.js`, { ignore: ['node_modules/**', 'commands/slash-type/**'] })
        return jsfiles
      }

      // Si no hay argumentos, se mostrará la información del propio comando.
      if (!args[0]) {
        const commandsNoArgs = require(`../bot/commandinfo.js`);
        const aliasComandoNoArgs = commandsNoArgs.alias ? commandsNoArgs.alias.join(`, ${client.prefix}`) : "No tiene";

        const FaltaDeArgumentos = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle(`Commands: ${commandsNoArgs.nombre}`)
          .addFields({ name: 'Nombres', value: `t!${commandsNoArgs.nombre} (${aliasComandoNoArgs})`, inline: true })
          .addFields({ name: 'Categoría', value: commandsNoArgs.categoria, inline: true })
          .addFields({ name: 'Descripción', value: commandsNoArgs.descripcion })

        return message.reply({ embeds: [FaltaDeArgumentos] })
      }

      // Si hay argumentos, se mostrará la información del comando que se pidió o sino el mas cercano. Si no hay ninguno, se mostrará un mensaje de error.
      findFile(args[0]).then((result) => {
        if (!result[0] === "") return message.reply({ content: "Error!" })

        // Quitamos el path del archivo y dejamos solo el nombre del archivo.

        // Verificamos si hay un resultado.
        const filepath = result[0] ?
          // Si es verdadero, realiza el reemplazo.
          result[0].replace(/^.*\\(commands\\|message-type)\\/, '') :
          // Si es falso, dejaremos un "NO_COMMAND" en su lugar.
          "NO_COMMAND";

        // Si el resultado es "NO_COMMAND", se mostrará un mensaje de error.
        if (filepath == "NO_COMMAND") return message.reply({ content: `No encontré ningún comando llamado: \`${args[0]}\`` })

        // Sino pasa nada de lo anterior, se mostrará la información del comando.
        const commands = require(`..\\${filepath}`);

        let aliasComando = commands.alias.length > 0 ? commands.alias.join(`, `) : "No tiene";
        let nombreComando = commands.nombre ? commands.nombre : "No tiene";
        let categoriaComando = commands.categoria ? commands.categoria : "No tiene";
        let comandoDescripcion = commands.descripcion ? commands.descripcion : "No tiene";
        let tieneHelp = commands.tieneHelp >= 0 ? commands.tieneHelp : "No tiene";

        /* 
        "tieneHelp" se refiere si el comando cuenta con una guía.
        Si es ese caso ("tieneHelp" == 1) significa que, cuando lo llames, este no se ejecutara, ya que antes te mostrara una guía o texto de como usarlo.
        Si en el caso contrario ("tieneHelp" == 0) significa que el comando se ejecutara al momento que lo llames.
        */
        if (tieneHelp === 0) {
          tieneHelp = "El comando no cuenta con ningún help.";
        } else if (tieneHelp === 1) {
          tieneHelp = "El comando cuenta con un help, ejecútelo para verlo.";
        }

        const embedCommandInfo = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle(`💾 | ${nombreComando}`)
          .addFields({ name: 'Nombres (alias)', value: `t!${nombreComando} (${aliasComando})`, inline: true })
          .addFields({ name: 'Categoría', value: categoriaComando, inline: true })
          .addFields({ name: "Tiene Help?", value: tieneHelp })
          .addFields({ name: 'Descripción', value: comandoDescripcion })

        return message.reply({ embeds: [embedCommandInfo] })
      })
    } catch (error) {
      message.reply({ content: `${client.emoji.warning} 『 **Acaba de ocurrir un error al intentar ejecutar el comando, inténtalo mas tarde.** 』` })
      console.error(error.message);
    }
  }
}