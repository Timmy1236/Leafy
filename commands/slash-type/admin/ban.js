const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario del servidor.")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.BanMembers)
    .setDMPermission(false)
    .addUserOption(option => option
      .setName('usuario')
      .setDescription('El usuario que quieras banear.')
      .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("motivo")
        .setDescription("Cual es la razón del ban para el usuario.")
    ),
  async run(client, interaction) {

    // Primero comprobamos si tenemos permisos de ban, sino se enviara un embed.
    const noPermissionEmbed = new Discord.EmbedBuilder()
      .setDescription("No puedo hacerlo, no tengo el permiso necesario para banear usuarios.")
      .setColor(client.color)

    if (!interaction.guild.members.me.permissions.has(Discord.PermissionsBitField.Flags.BAN_MEMBERS))
      return interaction.reply({ embeds: [noPermissionEmbed], ephermal: true })

    // Si tenemos el permiso, empezamos agarrar todos los datos posibles.
    const { options } = interaction;
    const user = options.getUser("usuario")
    const reason = options.getString("motivo") || "Ningún motivo dado."

    const member = await interaction.guild.members.fetch(user.id)

    // Si el usuario que deseas banear es el propio bot, se enviara un embed de que no es posible banearse el mismo.
    const banBotEmbed = new Discord.EmbedBuilder()
      .setTitle("❌ | Error")
      .setDescription("No me puedo banearme.")
      .setColor(client.color)

    if (user.id === client.user.id)
      return interaction.reply({ embeds: [banBotEmbed], ephermal: true })

    // Si el usuario que deseas banear tiene un rol mas alto.
    const highRolEmbed = new Discord.EmbedBuilder()
      .setTitle("❌ | Error")
      .setDescription(`No puedo banear a ${user}, tiene un rol que se encuentra superior.`)
      .setColor(client.color)

    if (member.roles.highest.position >= interaction.member.roles.highest.position)
      return interaction.reply({ embeds: [highRolEmbed], ephermal: true })

    // Una vez pasado por todos los checkeos, se baneara el usuario y enviaremos un embed de que el ban fue exitoso.
    await member.ban({ reason })

    console.log(user)

    const banEmbed = new Discord.EmbedBuilder()
      .setTitle("🔨 | Ban")
      .setDescription(`El usuario **${user}** acaba de ser baneado del servidor.\n\nRazón:\n\`${reason}\``)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`)
      .setColor(client.color)
      .setTimestamp()

    await interaction.reply({ embeds: [banEmbed] })
  }
}