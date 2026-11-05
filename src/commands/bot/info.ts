import packagejson from "../../../package.json" with { type: "json" };
import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, version, MessageFlags } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";
import { cLog } from "../../utils/cLog.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Información sobre el bot.")
    .addSubcommand(subcommand => subcommand.setName("general").setDescription("Muestra información general del bot."))
    .addSubcommand(subcommand => subcommand.setName("entorno").setDescription("Muestra información del entorno de ejecución."))
    .addSubcommand(subcommand => subcommand.setName("estadisticas").setDescription("Muestra las estadísticas del bot.")),
  categoria: "Bot",
  run: async (client, interaction): Promise<void> => {
    const uptime = client.uptime;
    const user = client.user;

    if (!user) {
      await interaction.reply({ content: "El bot todavía está iniciando.", flags: MessageFlags.Ephemeral });
      return;
    }

    // Uptime
    const uptimeSeconds = Math.floor((uptime ?? 0) / 1000);
    const days = Math.floor(uptimeSeconds / 86_400);
    const hours = Math.floor((uptimeSeconds % 86_400) / 3_600);
    const minutes = Math.floor((uptimeSeconds % 3_600) / 60);
    const seconds = uptimeSeconds % 60;
    const activity = `${days} días, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;

    // Stats discord
    const guilds = client.guilds.cache;
    const totalMembers = guilds.reduce((total, guild) => total + guild.memberCount, 0).toLocaleString();
    const serverCount = guilds.size.toLocaleString();
    const channelCount = client.channels.cache.size.toLocaleString();

    // System
    const memory = process.memoryUsage();
    const mb = (bytes: number): string => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    const language = packagejson.devDependencies?.typescript ? "TypeScript" : "JavaScript";
    const packageManager = packagejson.packageManager?.split("@")[0] ?? "No definido";
    const npmVersion = process.env.npm_config_user_agent?.match(/npm\/(\S+)/)?.[1];

    const githubButton = new ButtonBuilder()
      .setLabel("GitHub")
      .setURL("https://github.com/Timmy1236/Leafy")
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(githubButton);
    const subcommand = interaction.options.getSubcommand();
    const embed = new EmbedBuilder()
      .setAuthor({ name: user.username, iconURL: user.avatarURL() ?? undefined })
      .setColor(client.color);

    if (subcommand === "general") {
      embed.setDescription(packagejson.description);
    }
    else if (subcommand === "entorno") {
      embed.setDescription("Información de la maquina y de mi proceso, el consumo de recursos e información adicional.");
      embed.addFields(
        { name: "Lenguaje", value: language, inline: true },
        { name: "Discord.js", value: `v${version}`, inline: true },
        { name: "Node.js", value: process.version, inline: true },
        { name: "V8", value: process.versions.v8, inline: true },
        { name: "Gestor", value: `${packageManager}${npmVersion ? ` ${npmVersion}` : ""}`, inline: true },
        { name: "Sistema", value: `${process.platform} (${process.arch})`, inline: true },
        { name: "RAM del proceso (RSS)", value: mb(memory.rss), inline: true },
        { name: "Heap usado / total", value: `${mb(memory.heapUsed)} / ${mb(memory.heapTotal)}`, inline: true }
      );
    }
    else {
      embed.setDescription("Varias estadísticas de servidores y canales que estoy conectado ahora mismo, incluyendo cuanto tiempo llevo encendido.");
      embed.addFields(
        { name: "Uptime", value: activity, inline: false },
        { name: "Usuarios", value: totalMembers, inline: true },
        { name: "Servidores", value: serverCount, inline: true },
        { name: "Canales en caché", value: channelCount, inline: true },
        { name: "Latencia a la API", value: `${Math.round(client.ws.ping)} ms`, inline: true }
      );
    }

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};

export default command;
