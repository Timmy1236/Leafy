const alertBox = require("../../../utils/alertBox.js");
module.exports = {
  nombre: "rolinfo",
  alias: ["roleinfo", "rol"],
  descripcion: "Muestra información sobre un rol.",
  categoria: "🌐 Discord",
  ejemplos: ["rolinfo @rol"],
  run: async (Discord, client, message, args, _userDB, _serverDB) => {
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name === args.slice(1).join(" "));

    if (!rol) return message.reply({ embeds: [alertBox.createAlertBox("error", "Rol no encontrado. Asegúrate de mencionar un rol válido o usar su ID.")] });

    var permisos = rol.permissions.toArray().join('`, `');
    if (permisos.length === 0) permisos = "Ninguno";

    let trueOrFalse = {
      'true': 'Sí',
      'false': 'No'
    }

    // Lista de usuarios que tienen este rol
    const userWithThisRol = rol.members.map(m => `<@${m.id}>`);
    if (userWithThisRol.length === 0) userWithThisRol.push("Nadie tiene este rol.");
    if (userWithThisRol.length > 10) userWithThisRol.splice(10, userWithThisRol.length - 10, "...");

    const rolEmbed = new Discord.EmbedBuilder()
      .setTitle(`${rol.name}`)
      .addFields({ name: "▸ 📃 Info", value: `>>> **Nombre:** ${rol.name}\n**ID:** ${rol.id}\n**Posición:** ${rol.rawPosition}\n**Color hex:** ${rol.hexColor}\n**Mencionable:** ${trueOrFalse[rol.mentionable]}\n**Visible en la lista:** ${trueOrFalse[rol.hoist]}` })
      .addFields({ name: "▸ 🔰 Permisos", value: `>>> \`${permisos}\`` })
      .addFields({ name: `▸ 📜 Usuarios (${rol.members.size})`, value: `>>> ${userWithThisRol.join(", ")}` })
      .setColor(rol.hexColor);

    message.reply({ embeds: [rolEmbed] });
  }
}