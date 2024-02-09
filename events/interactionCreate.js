module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand) return; // Si la interacción no es un comando de chat, lo ignoramos.

  const slashCommand = client.slashcommands.get(interaction.commandName); // Obtenemos el comando de la colección de comandos de chat.

  if (!slashCommand) return; // Si el comando no existe, lo ignoramos.

  try {
    if (slashCommand.data.default_member_permissions && slashCommand.data.default_member_permissions.length > 0) {
      // Juntamos todos los permisos necesarios en un string separado por comas.
      let permisos = slashCommand.permisos.map(permiso => { return `\`${permiso}\``; }).join(", ");

      // Checkeamos si el usuario tiene los permisos necesarios para ejecutar el comando
      if (!interaction.member.permissions.has(slashCommand.data.default_member_permissions)) return await interaction.reply({ content: `No tienes el permiso **${permisos}** para ejecutar este comando.`, ephemeral: true });
      // Checkeamos si el bot también tiene los permisos necesarios para ejecutar el comando
      if (!interaction.guild.members.me.permissions.has(slashCommand.data.default_member_permissions)) return await interaction.reply({ content: `No tengo el permiso **${permisos}** para ejecutar este comando.`, ephemeral: true });
    }

    // Si el usuario cumple con los permisos necesarios, ejecutamos el comando.
    await slashCommand.run(client, interaction);

  } catch (error) { // Si ocurre un error al ejecutar el comando, devolvemos un mensaje de error y lo registramos en la consola para el debug.

    await interaction.reply({ content: "Acaba de ocurrir un error al ejecutar el comando.", ephemeral: true });
    console.log("Acaba de ocurrir un error al intentar ejecutar un slash-command")
    console.error(error);
  }
}