import { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kickea a un usuario del servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setContexts(InteractionContextType.Guild)
    .addUserOption(option => option.setName("usuario").setDescription("El usuario que deseas kickear.").setRequired(true))
    .addStringOption(option => option.setName("motivo").setDescription("¿Cual es la razón del kick?")) as SlashCommandBuilder,
  categoria: "🛡️ Moderación",
  permisos: ["KICK_MEMBERS"],
  run: async (client, interaction): Promise<void> => {
    const { options, guild } = interaction;
    const user = options.getUser("usuario", true);
    const reason = options.getString("motivo") || "Ningún motivo dado.";

    if (!interaction.inCachedGuild()) {
      await interaction.reply({ content: "Este comando solo funciona en servidores.", ephemeral: true });
      return;
    }

    const targetMember = await guild!.members.fetch(user.id).catch(() => null);

    if (!targetMember) { // NOTE: ALERTBOX
      return;
    }

    await interaction.deferReply();

    // Creamos un embed por si ocurre un error.
    const errorEmbed = new EmbedBuilder()
      .setTitle("❌ | Error")
      .setColor(client.color);

    // Si el usuario que desea kickear tiene un rol superior al del usuario que ejecuto el comando.
    if (targetMember.roles.highest.position >= interaction.member.roles.highest.position) {
      errorEmbed.setDescription("No puedes kickear a ese usuario porque tiene el mismo o un rol superior al tuyo.");
      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    // Si el usuario que desea kickear tiene un rol superior al del bot.
    if (targetMember.roles.highest.position >= interaction.guild.members.me!.roles.highest.position) {
      errorEmbed.setDescription("No puedo kickear a ese usuario porque tiene el mismo o un rol superior al mio.");
      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    // Si el usuario que desea kickear sea el propio bot.
    if (user.id === client.user!.id) {
      errorEmbed.setDescription("No me puedo kickear a mi mismo.");
      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    try {
      await targetMember.kick(reason);

      const kickEmbed = new EmbedBuilder()
        .setTitle("👞 | Kick")
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
        .setDescription("Un usuario acaba de ser kickeado en este servidor.")
        .addFields({ name: "▸ 👤 Usuario", value: `>>> **Username:** ${user.username}\n**ID:** ${user.id}` })
        .addFields({ name: "▸ 📄 Razón", value: `>>> \`${reason}\`` })
        .setColor(client.color)
        .setTimestamp();

      await interaction.editReply({ embeds: [kickEmbed] });
    }
    catch (error) {
      await interaction.editReply({ content: `${client.botEmojis.warning} 『 Acaba de ocurrir un error al intentar kickear a este usuario 』` });
      console.error(error);
    }
  }
};

export default command;
