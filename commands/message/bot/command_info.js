const { glob } = require('node:fs/promises');
module.exports = {
  nombre: "commandinfo",
  alias: ["cmdinfo", "comandoinfo", "comando-info", "cmd-info"],
  descripcion: "Obtén información de los comandos message-type, sobre su función, como usarlo, etc. Los slash-type ya cuentan con su información en la propia UI de Discord.",
  categoria: "🤖 Bot",
  run: async (Discord, client, message, args, userDB, serverDB) => {
    try {
      async function findFile(file) {
        const jsfiles = [];

        for await (const path of glob(`commands/message-type/*/${file}.js`)) {
          jsfiles.push(path);
        }

        return jsfiles;
      }

      const command = args[0] ? args[0] : "command_info";

      // Si hay un argumento, buscamos el comando, en caso que no lo haya, mostraremos la misma info del propio comando "command_info"
      findFile(command).then((result) => {
        const filepath = result[0] ? result[0].replace(/^.*\\(commands\\|message-type)\\/, '') : false;
        if (!filepath) return message.reply({ content: `No encontré ningún comando llamado: \`${command}\`` })

        const commands = require(`..\\${filepath}`);
        let comandoNombre = commands.nombre ? commands.nombre : "No tiene";
        let comandoAlias = commands.alias.length > 0 ? commands.alias.join(`, `) : "No tiene";
        let comandoDescripcion = commands.descripcion ? commands.descripcion : "No tiene";
        let comandoCategoria = commands.categoria ? commands.categoria : "No tiene";
        let comandoEjemplos = commands.ejemplos ? commands.ejemplos.join(`\n`) : "Este comando no tiene ejemplos, ejecútalo de forma normal.";

        const embed = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle(`${comandoNombre}`)
          .addFields({ name: 'Descripción', value: comandoDescripcion })
          .addFields({ name: 'Alias', value: `${comandoAlias}`, inline: true })
          .addFields({ name: 'Categoría', value: comandoCategoria, inline: true })
          .addFields({ name: 'Ejemplos', value: client.prefix + comandoEjemplos })
        return message.reply({ embeds: [embed] })
      })
    } catch (error) {
      message.reply({ content: `${client.botEmojis.warning} 『 **Acaba de ocurrir un error al intentar ejecutar el comando, inténtalo mas tarde.** 』` })
      console.error(error.message);
    }
  }
}