const Discord = require("discord.js");
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtén los comandos de mensajes o slash de Leafy."),
  categoria: "Bot",
  async run(client, interaction) {
    // Declaramos los comandos de client.cmd y client.slashcommands
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

    // La lista de opciones del menú.
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
      )
      );

    // Añadimos el menú para el action row que sera enviado con el embed.
    const actionRow = new Discord.ActionRowBuilder().addComponents(selectMenu);

    const help = new Discord.EmbedBuilder()
      .setColor(client.color)
      .setTitle('📙 | Comandos')
      .setDescription(`${Commands.length} Comandos en total.`)
      .setThumbnail(client.user.avatarURL())
      .addFields({ name: `▸ ${client.emoji.discord} Discord`, value: `>>> ${getCommands(client, 'Discord')}` })
      .addFields({ name: `▸ 🤖 Bot`, value: `>>> ${getCommands(client, 'Bot')}` })

    const reply = await interaction.reply({ embeds: [help], components: [actionRow] })

    // El collector para recibir las opciones del menú que eligió el usuario.
    const collector = reply.createMessageComponentCollector({
      componentType: Discord.ComponentType.StringSelect,
      filter: (i) => i.user.id === interaction.user.id && i.customId === interaction.id,
      time: 60_000,
    });

    collector.on('collect', async (interaction) => {
      switch (interaction.values[0]) {
        case "slash":
          const helpSlash = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setTitle('📙 | Slash')
            .setThumbnail(client.user.avatarURL())
            .setDescription(`${slashCommands.length} SlashCommands en total.`)
            .addFields({ name: `▸ ${client.emoji.discord} Discord`, value: `>>> ${getSlashCommands(client, 'Discord')}` })
            .addFields({ name: `▸ 🤖 Bot`, value: ` >>> ${getSlashCommands(client, 'Bot')}` })
            .addFields({ name: `▸ 👮 Moderación`, value: `>>> ${getSlashCommands(client, 'Moderacion')}` })

          interaction.update({ embeds: [helpSlash] })
          break;
        case "commands":
          interaction.update({ embeds: [help] })
          break;
      }
    })
  }
}