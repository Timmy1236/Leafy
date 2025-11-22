const User = require("../db/models/user.js");
const Server = require("../db/models/server.js");

module.exports = async (client, interaction) => {
  const slashCommand = client.slashCommands.get(interaction.commandName);

  if (!slashCommand) return;
  if (!interaction.isChatInputCommand()) return;

  try {
    const [userDB] = await User.findOrCreate({ where: { id: interaction.user.id } });
    const [serverDB] = await Server.findOrCreate({ where: { id: interaction.guild.id } });

    // Manejo de permisos 
    if (
      slashCommand.data.default_member_permissions &&
      slashCommand.data.default_member_permissions.length > 0
    ) {
      const permisosArray = Array.isArray(slashCommand.data.default_member_permissions)
        ? slashCommand.data.default_member_permissions
        : [slashCommand.data.default_member_permissions];

      const permisos = permisosArray.map(permiso => `\`${permiso}\``).join(", ");

      if (!interaction.member.permissions.has(permisosArray)) {
        return await interaction.reply({
          content: `No tienes el permiso **${permisos}** para ejecutar este comando.`,
          ephemeral: true
        });
      }

      if (!interaction.guild.members.me.permissions.has(permisosArray)) {
        return await interaction.reply({
          content: `No tengo el permiso **${permisos}** para ejecutar este comando.`,
          ephemeral: true
        });
      }
    }

    // Ejecutar el comando
    await slashCommand.run(client, interaction, userDB, serverDB);

  } catch (error) {
    console.error("Error al ejecutar el comando:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "⚠️ | Ha ocurrido un error inesperado al ejecutar el comando.", ephemeral: true });
    } else {
      await interaction.editReply({ content: "⚠️ | Ha ocurrido un error inesperado al ejecutar el comando.", ephemeral: true });
    }
  }
};
