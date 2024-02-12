const Discord = require("discord.js")
const axios = require("axios")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("template")
    .setDescription("Crea un template del servidor")
    .addStringOption(option => option.setName('nombre').setDescription('El nombre que tendrá el template').setRequired(true))
    .addStringOption(option => option.setName('descripcion').setDescription('La descripción que tendrá el template').setRequired(true))
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  categoria: "Moderacion",
  permisos: ["ADMINISTRATOR"],
  async run(client, interaction) {

    const { options } = interaction;
    const nombre = options.getString("nombre")
    const descripcion = options.getString("descripcion")

    // Creamos un template usando axios y le pasamos el nombre y la descripción que el usuario puso.
    const template = await axios.post(`https://discord.com/api/v10/guilds/${interaction.guild.id}/templates`,
      {
        name: nombre,
        description: descripcion
      },
      {
        headers: {
          'Authorization': `Bot ${client.token}`,
          'content-type': "application/json"
        }
      }
    ).catch(err => {
      //console.error(err)
      return interaction.reply({ content: "⚠ | Acaba de ocurrir un error al intentar crear el template! Ten en cuenta que solamente puede existir un template a la vez." })
    });

    const templateEmbed = new Discord.EmbedBuilder()
      .setColor(client.color)
      .setTitle(`✅ | El template **${nombre}** ha sido creado con éxito!`)
      .setDescription(`URL: https://discord.new/${template.data.code}`)

    await interaction.reply({ embeds: [templateEmbed], ephemeral: true })
  }
}