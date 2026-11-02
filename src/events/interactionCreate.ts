import { GuildMember, PermissionsBitField } from "discord.js";
import { getUserOrCreate } from "../db/user.js";
import { getServerOrCreate } from "../db/server.js";
import { Event } from "../types/Events.js";
import { cLog } from "../utils/cLog.js";

const event: Event<"interactionCreate"> = {
  name: "interactionCreate",
  once: false,
  execute: async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const slashCommand = client.slashCommands.get(interaction.commandName);
    if (!slashCommand) return;

    if (!interaction.guild || !interaction.member) return;

    try {
      const userDB = getUserOrCreate(interaction.user.id);
      const serverDB = getServerOrCreate(interaction.guild.id);

      const rawPermissions = slashCommand.data.default_member_permissions;

      // NOTE: Teóricamente, no es necesario hacer este checkeo porque "supuestamente", Discord se encarga de verificar que el usuario tenga los permisos.
      if (rawPermissions) {
        const required = new PermissionsBitField(BigInt(rawPermissions));
        const permisosString = required.toArray().map(p => `\`${p}\``).join(", ");

        if (!(interaction.member as GuildMember).permissions.has(required)) {
          await interaction.reply({ content: `No tienes los permisos: ${permisosString}`, ephemeral: true });
          return;
        }

        if (!interaction.guild.members.me?.permissions.has(required)) {
          await interaction.reply({ content: `No tengo los permisos necesarios: ${permisosString}`, ephemeral: true });
          return;
        }
      }

      await slashCommand.run(client, interaction, userDB, serverDB);
    }
    catch (e) {
      cLog("ERROR", "Error al intentar ejecutar un comando!", e);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: "⚠️ | Ha ocurrido un error inesperado al ejecutar el comando.", ephemeral: true });
      }
      else {
        await interaction.editReply("⚠️ | Ha ocurrido un error inesperado al ejecutar el comando.");
      }
    }
  }
};

export default event;
