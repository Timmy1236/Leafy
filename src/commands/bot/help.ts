import { SlashCommandBuilder, EmbedBuilder, Collection } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Obtén los comandos de Leafy."),
  categoria: "🤖 Bot",
  run: async (client, interaction): Promise<void> => {
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
      const formattedCommands = commandsInCategory.map((name) => `\`${name}\``);
      return formattedCommands.join(' | ') || 'Ninguno';
    }

    const slashCommands = client.slashCommands;

    // Función para generar fields dinámicamente
    function generateFields(collection: Collection<string, SlashCommand>) {
      const categories = getCategory(collection);
      return categories.map((category) => ({
        name: `▸ ${category}`,
        value: `>>> ${getCommandsByCategory(collection, category as string)}`
      }));
    }

    const help = new EmbedBuilder()
      .setColor(client.color)
      .setTitle('📙 | Comandos Slash')
      .setDescription(`${slashCommands.size} Comandos en total.`)
      .setThumbnail(client.user!.avatarURL())
      .addFields(...generateFields(slashCommands));

    await interaction.reply({ embeds: [help] })
  }
}

export default command;