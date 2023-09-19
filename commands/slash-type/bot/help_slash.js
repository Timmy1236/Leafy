const Discord = require("discord.js");
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtén los comandos de Leafy Boy!")
    .addStringOption(option => option
      .setName('option')
      .setDescription('Categoría de comandos')
      .setRequired(false)
      .addChoices(
        { name: 'Slash', value: 'slash' },
      ),
    ),
  async run(client, interaction) {
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
    switch (interaction.options.getString("option")) {
      case "slash":
        const helpSlash = new Discord.EmbedBuilder()
          .setColor("#fca32b")
          .setTitle('📙 | Slash')
          .setThumbnail(client.user.avatarURL())
          .addFields({ name: '▸ 📎 Slash', value: `>>> ${comandosSlash}` })
        interaction.reply({ embeds: [helpSlash] })
        break;

      default:
        const help = new Discord.EmbedBuilder()
          .setColor("#fca32b")
          .setTitle('📙 | Comandos')
          .setDescription(`${Commands.length} Comandos en total.`)
          .setThumbnail(client.user.avatarURL())
          .addFields({ name: `▸ <:Discord:1146184569373073510> Discord`, value: `>>> ${comandosDiscord}` })
          .addFields({ name: `▸ 🤖 Bot`, value: `>>> ${comandosBot}` })
        interaction.reply({ embeds: [help] })
        break;
    }
  }
}