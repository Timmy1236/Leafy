const { glob } = require('glob');
module.exports = {
  nombre: "commandinfo",
  alias: [],
  descripcion: "Obtén información de los comandos individualmente, sobre su función, como usarlo, etc.",
  categoria: "🤖 Bot",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    try {
      async function findFile(file) {
        const jsfiles = await glob(`**/${file}.js`, { ignore: 'node_modules/**' })
        return jsfiles
      }

      if (!args[0]) {
        const commandsNoArgs = require(`../bot/commandinfo.js`);
        const aliasComandoNoArgs = commandsNoArgs.alias ? commandsNoArgs.alias.join(`, ${prefix}`) : "No tiene";

        const FaltaDeArgumentos = new Discord.EmbedBuilder()
          .setColor('#facc56')
          .setTitle(`Commands: ${commandsNoArgs.nombre}`)
          .addFields({ name: 'Nombres', value: `t!${commandsNoArgs.nombre} (${aliasComandoNoArgs})`, inline: true })
          .addFields({ name: 'Categoría', value: commandsNoArgs.categoria, inline: true })
          .addFields({ name: 'Descripción', value: commandsNoArgs.descripcion })
        return message.reply({ embeds: [FaltaDeArgumentos] })
      }

      findFile(args[0]).then((result) => {
        if (!result[0] === "") return message.reply({ content: "Error!" })

        const filepath = result[0] ? result[0].replace(/^.*\\(commands\\|message-type)\\/, '') : "NO_COMMAND";
        if (filepath == "NO_COMMAND") return message.reply({ content: `No encontré ningún comando llamado: \`${args[0]}\`` })

        const commands = require(`..\\${filepath}`);

        let aliasComando = commands.alias.length > 0 ? commands.alias.join(`, `) : "No tiene";
        let nombreComando = commands.nombre ? commands.nombre : "No tiene";
        let categoriaComando = commands.categoria ? commands.categoria : "No tiene";
        let comandoDescripcion = commands.descripcion ? commands.descripcion : "No tiene";
        let tieneHelp = commands.tieneHelp >= 0 ? commands.tieneHelp : "No tiene";

        if (tieneHelp === 0) {
          tieneHelp = "El comando no cuenta con ningún help.";
        } else if (tieneHelp === 1) {
          tieneHelp = "El comando cuenta con un help, ejecútelo para verlo.";
        }

        const embedCommandInfo = new Discord.EmbedBuilder()
          .setColor('#facc56')
          .setTitle(`💾 | ${nombreComando}`)
          .addFields({ name: 'Nombres (alias)', value: `t!${nombreComando} (${aliasComando})`, inline: true })
          .addFields({ name: 'Categoría', value: categoriaComando, inline: true })
          .addFields({ name: "Tiene Help?", value: tieneHelp })
          .addFields({ name: 'Descripción', value: comandoDescripcion })
        return message.reply({ embeds: [embedCommandInfo] })
      })
    } catch (e) {
      message.reply({ content: `⚠️ | Acaba de ocurrir un error, inténtalo de nuevo.` })
      console.error(err.message);
    }
  }
}