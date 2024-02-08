module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand) return; // Si la interacción no es un comando de chat, lo ignoramos.

  const slashCommand = client.slashcommands.get(interaction.commandName); // Obtenemos el comando de la colección de comandos de chat.

  if (!slashCommand) return; // Si el comando no existe, lo ignoramos.

  try {
    // Si el comando cuenta con permisos y el usuario no tiene los permisos necesarios, devolvemos un mensaje de error.
    if (slashCommand.permissions && slashCommand.permissions.length > 0) {
      if (!interaction.member.permissions.has(slashCommand.userPermissions)) return await interaction.reply({ content: `No tienes el permiso ${slashCommand.userPermissions} para ejecutar este comando.`, ephemeral: true });
    }
    // Si el usuario cumple con los permisos necesarios, ejecutamos el comando.
    await slashCommand.run(client, interaction);
  } catch (error) { // Si ocurre un error al ejecutar el comando, devolvemos un mensaje de error y lo registramos en la consola para el debug.
    await interaction.reply({ content: "Acaba de ocurrir un error al ejecutar el comando.", ephemeral: true });
    console.log("Acaba de ocurrir un error al intentar ejecutar un slash-command")
    console.error(error);
  }
}