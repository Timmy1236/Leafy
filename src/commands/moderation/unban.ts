import { SlashCommandBuilder, EmbedBuilder, InteractionContextType, PermissionFlagsBits, MessageFlags } from "discord.js";
import { SlashCommand } from "../../types/Commands.js";
import { cLog } from "../../utils/cLog.js";
import { isValidSnowflake } from "../../utils/utils.js";

const command: SlashCommand = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Quita el ban a un usuario de este servidor.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setContexts(InteractionContextType.Guild)
    .addStringOption(option => option.setName("usuario_id").setDescription("El ID del usuario que deseas quitar el ban.").setRequired(true)),
  categoria: "Moderación",
  run: async (client, interaction): Promise<void> => {
    const { options } = interaction;
    const userID = options.getString("usuario_id", true);

    try {
      await interaction.deferReply();
      if (isValidSnowflake(userID)) {
        await interaction.guild.members.unban(userID);

        const unbanEmbed = new EmbedBuilder()
          .setTitle("🩹 | Desban")
          .setDescription("Un usuario acaba de ser desbaneado en este servidor.")
          .addFields({ name: "▸ 👤 Usuario", value: `>>> **ID:** ${userID}` })
          .setColor(client.color)
          .setTimestamp();

        await interaction.editReply({ embeds: [unbanEmbed] });
      }
      else {
        await interaction.editReply({ content: `${client.botEmojis.error} 『 La ID del usuario no es valida 』` });
      }
    }
    catch (e) {
      await interaction.followUp({ content: "Acaba de ocurrir un error al intentar ejecutar este comando.", flags: MessageFlags.Ephemeral });
      cLog("ERROR", "Error en el comando unban", e);
    }
  }
};

export default command;
