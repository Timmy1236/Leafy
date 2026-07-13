import { PermissionResolvable, GuildMember } from "discord.js";
import { getUserOrCreate } from "../db/user.js";
import { getServerOrCreate } from "../db/server.js";
import { Event } from "../types/Events.js";

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

      if (rawPermissions) {
        const permisosArray: PermissionResolvable[] = Array.isArray(rawPermissions)
          ? (rawPermissions as PermissionResolvable[])
          : [rawPermissions as PermissionResolvable];

        const permisosString = permisosArray.map(p => `\`${p}\``).join(", ");

        const member = interaction.member as GuildMember;
        if (!member.permissions.has(permisosArray)) {
          return await interaction.reply({
            content: `No tienes los permisos: ${permisosString}`,
            ephemeral: true
          });
        }

        if (!interaction.guild.members.me?.permissions.has(permisosArray)) {
          return await interaction.reply({
            content: `No tengo los permisos necesarios: ${permisosString}`,
            ephemeral: true
          });
        }
      }

      await slashCommand.run(client, interaction, userDB, serverDB);

    } catch (error) {
      console.error("Error al ejecutar el comando:", error);

      const errorMsg = { content: "⚠️ | Ha ocurrido un error inesperado al ejecutar el comando." };

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ ...errorMsg, ephemeral: true });
      } else {
        await interaction.editReply(errorMsg);
      }
    }
  }
};

export default event;