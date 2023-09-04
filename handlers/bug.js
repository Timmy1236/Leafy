const config = require('../config.json');

module.exports = async client => {
  client.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');

    const channel = client.channels.cache.get(config.CHANNEL_ALERTS);
    channel.send({ content: `Title: ${title}\n\nDesc: ${description}` });
    await interaction.reply({ content: 'Enviado.' });
  })
}