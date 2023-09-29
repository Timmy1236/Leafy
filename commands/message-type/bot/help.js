module.exports = {
  nombre: "help",
  alias: ["comando"],
  descripcion: "Obtén una lista de todos los comandos disponibles.",
  categoria: "Bot",
  tieneHelp: 1,
  run: async (Discord, client, message, args) => {
    await message.channel.sendTyping()
    const Commands = Array.from(client.cmd.keys());
    const slashCommands = Array.from(client.slashcommands.keys());

    // Obtenemos los comandos de client.cmd y los filtra por categoría
    function getCommands(client, categoria) {
      // Filtra los nombres de los comandos por su categoría
      const comandosEnCategoria = Commands.filter((nombre) => {
        const comando = client.cmd.get(nombre);
        return comando && comando.categoria === categoria;
      });
      const comandosFormateados = comandosEnCategoria.map((nombre) => `\`${nombre}\``);
      return comandosFormateados.join(' | ');
    }

    // Obtenemos los comandos de client.slashcommands
    function getSlashCommands(client) {
      const comandosEnCategoria = slashCommands.filter((nombre) => {
        const comando = client.slashcommands.get(nombre);
        return comando;
      });
      const comandosFormateados = comandosEnCategoria.map((nombre) => `\`\\${nombre}\``);
      return comandosFormateados.join(' | ');
    }

    const comandosBot = getCommands(client, 'Bot');
    const comandosDiscord = getCommands(client, 'Discord');
    const comandosSlash = getSlashCommands(client);

    switch (args[0] ? args[0].toLowerCase() : undefined) {
      case "slash":
        const helpSlash = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle('📙 | Slash')
          .setThumbnail(client.user.avatarURL())
          .addFields({ name: '▸ 📎 Slash', value: `>>> ${comandosSlash}` })
        message.reply({ embeds: [helpSlash] })
        break;

      default:
        const help = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle('📙 | Comandos')
          .setThumbnail(client.user.avatarURL())
          .setDescription(`📓 **Sub-Helps**: ${client.prefix}help slash\n${Commands.length} Comandos en total.`)
          .addFields({ name: `▸ ${client.emoji.discord} Discord`, value: `>>> ${comandosDiscord}` })
          .addFields({ name: `▸ 🤖 Bot`, value: `>>> ${comandosBot}` })
        message.reply({ embeds: [help] })
        break;
    }
  }
}