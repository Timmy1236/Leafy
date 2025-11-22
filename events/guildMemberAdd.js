const Server = require("../db/models/server.js");

module.exports = async (client, user) => {
  const serverDB = await Server.findOne({ where: { id: user.guild.id } });

  if (!serverDB || !serverDB.welcomeChannel) {
    console.log(`No se encontró un canal de bienvenida configurado para el servidor: ${user.guild.id}`);
    return;
  }

  const welcomeChannel = user.guild.channels.cache.get(serverDB.welcomeChannel);
  if (!welcomeChannel) {
    console.log(`El canal de bienvenida configurado no existe: ${serverDB.welcomeChannel}`);
    return;
  }

  welcomeChannel.send(`¡Bienvenido al servidor, <@${user.id}>!`);
}