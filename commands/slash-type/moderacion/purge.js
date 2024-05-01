const Discord = require("discord.js")
module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("purge")
    .setDescription("Elimina una cantidad de mensajes del canal actual")
    .setDefaultMemberPermissions(Discord.PermissionFlagsBits.ManageMessages)
    .setDMPermission(false)
    .addStringOption(option => option.setName('cantidad').setDescription('La cantidad de mensajes que quieras borrar').setRequired(true)),
  categoria: "Moderacion",
  permisos: ["MANAGE_MESSAGES"],
  async run(client, interaction) {
    try {

      const { options } = interaction;
      const cantidad = options.getString("cantidad")

      // Checkeamos que cantidad sea solamente numeros
      if (isNaN(cantidad)) {
        await interaction.reply({ content: "❌ | La cantidad de mensajes debe ser un número.", ephemeral: true })
        return;
      }

      // Si solamente son números, pero este es mayor a 100, retornamos un mensaje de error (Discord no permite borrar mas de 100 mensajes a la vez)
      if (cantidad > 100) {
        await interaction.reply({ content: "❌ | No puedes borrar más de 100 mensajes a la vez.", ephemeral: true })
        return;
      }

      // Hacemos un bulkDelete con la cantidad de mensajes que el usuario puso
      await interaction.channel.bulkDelete(cantidad)

      // Creamos un embed para notificar que los mensajes han sido eliminados
      const embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setDescription(`🗑️ | ${cantidad} mensajes han sido eliminados de este canal.`)

      // Enviamos el embed
      await interaction.reply({ embeds: [embed], ephemeral: true })
    } catch (error) {
      await interaction.reply({ content: `${client.emoji.warning} 『 Acaba de ocurrir un error al ejecutar el comando 』`, ephemeral: true });
      console.error(error)
    }
  }
}