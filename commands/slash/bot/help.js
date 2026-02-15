const Discord = require("discord.js");
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtén los comandos de Leafy."),
  categoria: "🤖 Bot",
  async run(client, interaction) {

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

    // Función para generar fields dinámicamente
    function generateFields(collection) {
      const categories = getCategory(collection);
      return categories.map(category => ({
        name: `▸ ${category}`,
        value: `>>> ${getCommandsByCategory(collection, category)}`
      }));
    }

    // Opciones del menú
    const optionsMenu = [
      {
        label: 'Commands',
        description: 'Comandos por medio de mensajes, los clásicos.',
        value: 'commands',
        emoji: '📝',
      },
      {
        label: 'Slash Commands',
        description: 'Comandos por medio de slash, fáciles de usar y con más funciones.',
        value: 'slash',
        emoji: '📎',
      }
    ]

    // Creamos el menú.
    const selectMenu = new Discord.StringSelectMenuBuilder()
      .setCustomId(interaction.id)
      .setPlaceholder('Selecciona una opción...')
      .addOptions(optionsMenu.map((option) =>
        new Discord.StringSelectMenuOptionBuilder()
          .setLabel(option.label)
          .setDescription(option.description)
          .setValue(option.value)
          .setEmoji(option.emoji)
      ));

    // Añadimos el menú para el action row que sera enviado con el embed.
    const actionRow = new Discord.ActionRowBuilder().addComponents(selectMenu);

    const help = new Discord.EmbedBuilder()
      .setColor(client.color)
      .setTitle('📙 | Comandos Slash')
      .setDescription(`${slashCommands.size} Comandos en total.`)
      .setThumbnail(client.user.avatarURL())
      .addFields(...generateFields(slashCommands));

    const reply = await interaction.reply({ embeds: [help], components: [actionRow] })

    // El collector para recibir las opciones del menú que eligió el usuario.
    const collector = reply.createMessageComponentCollector({
      componentType: Discord.ComponentType.StringSelect,
      filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
      time: 60_000,
    });

    collector.on('collect', async (interaction) => {
      switch (interaction.values[0]) {
        case "commands": {
          const helpClassicCommands = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle('📙 | Comandos')
            .setDescription(`${Commands.size} Comandos en total.`)
            .setThumbnail(client.user.avatarURL())
            .addFields(...generateFields(Commands));
          interaction.update({ embeds: [helpClassicCommands] })
          break;
        }
        case "slash":
          interaction.update({ embeds: [help] })
          break;
      }
    })
  }
}