import { getServerOrCreate } from "../db/server.js";
import { Event } from "../types/Events.js";
import { cLog } from "../utils/cLog.js";

const event: Event<"guildMemberAdd"> = {
  name: "guildMemberAdd",
  once: false,
  execute: async (client, member) => {
    const serverDB = getServerOrCreate(member.guild.id);
    if (!serverDB.welcomeChannel) return;

    const welcomeChannel = member.guild.channels.cache.get(serverDB.welcomeChannel);
    if (!welcomeChannel) {
      cLog("ADVERTENCIA", `El canal de bienvenida configurado: ${serverDB.welcomeChannel} dejo de existir?`);
      return;
    }

    if (!welcomeChannel.isTextBased()) {
      cLog("ADVERTENCIA", `Alguien configuro un canal de bienvenida: ${serverDB.welcomeChannel} y resulta que no es un canal de texto!?`);
      return;
    }

    await welcomeChannel.send(`¡Bienvenido al servidor, <@${member.user.id}>!`);
  }
};

export default event;
