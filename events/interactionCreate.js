module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand) return;
  const slashComs = client.slashcommands.get(interaction.commandName);
  if (slashComs) {
    slashComs.run(client, interaction);
  } else {
    return;
  }
}