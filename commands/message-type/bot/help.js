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
    function getSlashCommands(client, categoria) {
      const comandosEnCategoria = slashCommands.filter((nombre) => {
        const comando = client.slashcommands.get(nombre);
        return comando && comando.categoria === categoria;
      });
      const comandosFormateados = comandosEnCategoria.map((nombre) => `\`${nombre}\``);
      return comandosFormateados.join(' | ');
    }

    switch (args[0] ? args[0].toLowerCase() : undefined) {
      case "slash":
        const helpSlash = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle('📙 | Slash')
          .setThumbnail(client.user.avatarURL())
          .setDescription(`${slashCommands.length} SlashCommands en total.`)
          .addFields({ name: `▸ ${client.emoji.discord} Discord`, value: `>>> ${getSlashCommands(client, 'Discord')}` })
          .addFields({ name: `▸ 🤖 Bot`, value: ` >>> ${getSlashCommands(client, 'Bot')}` })
          .addFields({ name: `▸ 👮 Moderación`, value: `>>> ${getSlashCommands(client, 'Moderacion')}` })
        message.reply({ embeds: [helpSlash] })
        break;

      default:
        const help = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle('📙 | Comandos')
          .setThumbnail(client.user.avatarURL())
          .setDescription(`📎 **SlashCommands**: /help o ${client.prefix}help slash\n${Commands.length} Comandos en total.`)
          .addFields({ name: `▸ ${client.emoji.discord} Discord`, value: `>>> ${getCommands(client, 'Discord')}` })
          .addFields({ name: `▸ 🤖 Bot`, value: ` >>> ${getCommands(client, 'Bot')}` })
        message.reply({ embeds: [help] })
        break;
    }
  }
}