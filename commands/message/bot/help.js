module.exports = {
  nombre: "help",
  alias: ["comando"],
  descripcion: "Obtén una lista de todos los comandos disponibles.",
  categoria: "🤖 Bot",
  ejemplos: ["help slash"],
  run: async (Discord, client, message, args, userDB, serverDB) => {
    // Obtiene todas las categorías únicas de una colección de comandos
    function getCategory(collection) {
      const categories = new Set();
      for (const command of collection.values()) {
        if (command.categoria) categories.add(command.categoria);
      }
      return Array.from(categories);
    }

    // Obtiene los comandos de una categoría específica
    function getCommandsByCategory(collection, category) {
      const names = Array.from(collection.keys());
      const commandsInCategory = names.filter((name) => {
        const command = collection.get(name);
        return command && command.categoria === category;
      });
      const formattedCommands = commandsInCategory.map((name) => `\`${name}\``);
      return formattedCommands.join(' | ') || 'Ninguno';
    }

    const Commands = client.commands;
    const slashCommands = client.slashCommands;
    console.log(client)

    // Función para generar fields dinámicamente
    function generateFields(collection) {
      const categories = getCategory(collection);
      return categories.map(category => ({
        name: `▸ ${category}`,
        value: `>>> ${getCommandsByCategory(collection, category)}`
      }));
    }

    switch (args[0] ? args[0].toLowerCase() : undefined) {
      case "slash":
        const helpSlash = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle('📙 | Slash')
          .setThumbnail(client.user.avatarURL())
          .setDescription(`${slashCommands.size} SlashCommands en total.`)
          .addFields(...generateFields(slashCommands));
        message.reply({ embeds: [helpSlash] });
        break;

      default:
        const help = new Discord.EmbedBuilder()
          .setColor(client.color)
          .setTitle('📙 | Comandos')
          .setDescription(`**Comandos slash**: ${client.prefix}help slash\n**Comandos en total:** ${Commands.size}`)
          .addFields(...generateFields(Commands));
        message.reply({ embeds: [help] });
        break;
    }
  }
};