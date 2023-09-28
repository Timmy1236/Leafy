const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kickea a un usuario del servidor.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('El usuario que deseas kickear.')
      .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("motivo")
        .setDescription("¿Cual es la razón del kick?")
    ),
  userPermissions: [Discord.PermissionFlagsBits.KickMembers],
  async run(client, interaction) {
    const errorEmbed = new Discord.EmbedBuilder()
      .setTitle("❌ | Error")
      .setColor(client.color)

    const { options } = interaction;
    const user = options.getUser("usuario")
    const reason = options.getString("motivo") || "Ningún motivo dado."
    const member = await interaction.guild.members.fetch(user.id)

    await interaction.deferReply();

    // Si el usuario que desea kickear tiene un rol superior al del usuario que ejecuto el comando.
    if (member.roles.highest.position >= interaction.member.roles.highest.position) {
      errorEmbed.setDescription("No puedes kickear a ese usuario porque tiene el mismo o un rol superior al tuyo.");
      return interaction.editReply({ embeds: [errorEmbed], ephermal: true });
    }

    // Si el usuario que desea kickear tiene un rol superior al del bot.
    if (member.roles.highest.position >= interaction.guild.members.me.roles.highest.position) {
      errorEmbed.setDescription("No puedo kickear a ese usuario porque tiene el mismo o un rol superior al mio.");
      return interaction.editReply({ embeds: [errorEmbed], ephermal: true });
    }

    // Si el usuario que desea kickear sea el propio bot.
    if (user.id === client.user.id) {
      errorEmbed.setDescription("No me puedo kickear a mi mismo.")
      return interaction.editReply({ embeds: [errorEmbed], ephermal: true })
    }

    try {
      await member.kick({ reason })

      const kickEmbed = new Discord.EmbedBuilder()
        .setTitle("👞 | Kick")
        .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
        .setDescription(`Un usuario acaba de ser kickeado en este servidor.`)
        .addFields({ name: `▸ 👤 Usuario`, value: `>>> **Username:** ${user.username}\n**ID:** ${user.id}` })
        .addFields({ name: `▸ 📄 Razón`, value: `>>> \`${reason}\`` })
        .setColor(client.color)
        .setTimestamp()

      await interaction.editReply({ embeds: [kickEmbed] })
    } catch (error) {
      await interaction.editReply({ content: "⚠ | Acaba de ocurrir un error al intentar kickear a este usuario." })
      console.error(error)
    }
  }
}