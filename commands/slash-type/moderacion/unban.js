const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("unban")
    .setDescription("Quita el baneo a un usuario del servidor.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addStringOption(option => option.setName('usuarioid').setDescription('El usuario que deseas desbanear.').setRequired(true)),
  categoria: "Moderacion",
  permisos: ["BAN_MEMBERS"],
  async run(client, interaction) {

    const { options } = interaction;
    const userID = options.getString("usuarioid")

    // Función para validar si la id dada es un snowflake.
    function isValidSnowflake(id) {
      const snowflakeRegex = /^[0-9]{17,19}$/;
      return snowflakeRegex.test(id);
    }

    try {
      await interaction.deferReply(); // Dejamos el slash command en estado de "thinking".
      if (isValidSnowflake(userID)) { // Primero checkeamos si la id dada realmente es un snowflake.
        await interaction.guild.members.unban(userID); // Desbaneamos el usuario.

        const unbanEmbed = new Discord.EmbedBuilder()
          .setTitle("🩹 | Desban")
          .setDescription(`Un usuario acaba de ser desbaneado en este servidor.`)
          .addFields({ name: `▸ 👤 Usuario`, value: `>>> **ID:** ${userID}` })
          .setColor(client.color)
          .setTimestamp()

        await interaction.editReply({ embeds: [unbanEmbed] })
      } else { // Si la id dada no es un snowflake.
        await interaction.editReply({ content: `${client.emoji.error} 『 La ID del usuario no es valida 』` })
      }
    } catch (error) { // Si occure un error al intentar desbanear el usuario
      await interaction.editReply({ content: `${client.emoji.warning} 『 Acaba de ocurrir un error al intentar desbanear este usuario. 』` })
      console.error(error)
    }
  }
}