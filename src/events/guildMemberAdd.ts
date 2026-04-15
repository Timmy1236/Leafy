import Server from "../db/models/server.js";
import { Event } from "../types/Events.js";

const event: Event<"guildMemberAdd"> = {
  name: "guildMemberAdd",
  once: false,
  execute: async (client, interaction) => {
    const serverDB = await Server.findOne({ where: { id: interaction.guild.id } });

    if (!serverDB || !serverDB.welcomeChannel) {
      console.log(`No se encontró un canal de bienvenida configurado para el servidor: ${interaction.guild.id}`);
      return;
    }

    const welcomeChannel = interaction.guild.channels.cache.get(serverDB.welcomeChannel);
    if (!welcomeChannel) {
      console.log(`El canal de bienvenida configurado no existe: ${serverDB.welcomeChannel}`);
      return;
    }

    if (!welcomeChannel.isTextBased()) {
      console.warn(`El canal de bienvenida configurado no es un canal de texto: ${serverDB.welcomeChannel}`);
      return;
    }

    welcomeChannel.send(`¡Bienvenido al servidor, <@${interaction.user.id}>!`);
  }
};

export default event;