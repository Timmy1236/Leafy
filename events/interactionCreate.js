module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand) return;
  const slashCommand = client.slashcommands.get(interaction.commandName);

  if (!slashCommand) return;

  try {
    if (slashCommand.permissions && slashCommand.permissions.length > 0) {
      if (!interaction.member.permissions.has(slashCommand.userPermissions)) return await interaction.reply({ content: `No tienes el permiso ${slashCommand.userPermissions} para ejecutar este comando.`, ephemeral: true });
    }

    await slashCommand.run(client, interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "Acaba de ocurrir un error al ejecutar el comando.", ephemeral: true });
  }
}