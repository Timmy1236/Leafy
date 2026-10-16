import { SlashCommandBuilder, EmbedBuilder, Collection, GuildApplicationCommandManager } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtén los comandos de Leafy."),
  categoria: "🤖 Bot",
  run: async (client, interaction): Promise<void> => {
    const commandsFetched = await client.application!.commands.fetch();
    const commands = client.slashCommands;

    function getCategory(collection: Collection<string, SlashCommand>) {
      const categories = new Set();
      for (const command of collection.values()) {
        if (command.categoria) categories.add(command.categoria);
      }
      return Array.from(categories);
    }

    // Obtiene los comandos de una categoría específica
    function getCommandsByCategory(collection: Collection<string, SlashCommand>, category: string) {
      const names = Array.from(collection.keys());

      const commandsInCategory = names.filter((name) => {
        const command = collection.get(name);
        return command && command.categoria === category;
      });

      // NOTE: Los slash commands que tienen varias opciones, no serán clickeables, ya que hay que mencionar una opción o grupo, no el comando en general, fuck you Discord.
      const formattedCommands = commandsInCategory.map(name => `</${name}:${commandsFetched.findKey(c => c.name === name)}>`);
      return formattedCommands.join(" | ") || "Ninguno";
    }

    function generateFields(collection: Collection<string, SlashCommand>) {
      const categories = getCategory(collection);
      return categories.map(category => ({
        name: `▸ ${String(category)}`,
        value: `>>> ${getCommandsByCategory(collection, category as string)}`
      }));
    }

    const help = new EmbedBuilder()
      .setColor(client.color)
      .setTitle("📙 | Comandos Slash")
      .setDescription(`${commands.size} Comandos en total.`)
      .setThumbnail(client.user!.avatarURL())
      .addFields(...generateFields(commands));

    await interaction.reply({ embeds: [help] });
  }
};

export default command;
