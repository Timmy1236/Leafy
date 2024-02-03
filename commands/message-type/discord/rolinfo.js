module.exports = {
  nombre: "rolinfo",
  alias: ["roleinfo", "rol"],
  descripcion: "Muestra información sobre un rol.",
  categoria: "Discord",
  tieneHelp: 0,
  run: async (Discord, client, message, args) => {
    message.channel.sendTyping();

    // Obtenemos el rol
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name === args.slice(1).join(" "));

    // Si no se menciona o no tenemos la id de un rol
    if (!rol) return message.reply({ content: `❌ | Debes de mencionar un rol o añadir su id.` });

    // Obtenemos los permisos del rol y los juntamos separado por comas
    const permisos = rol.permissions.toArray().join('\`, \`');

    // Para convertir los booleanos a "Sí" o "No" en vez de "true" o "false"
    let trueOrFalse = {
      'true': 'Sí',
      'false': 'No'
    }

    // Obtenemos todos los miembros que tienen el rol en formato <@${id}>
    const usuariosConEsteRol = rol.members.map(m => `<@${m.id}>`);

    // Ahora, si el array de usuarios con el rol es mayor a 10, lo recortamos a 10 y añadimos un "..." al final
    if (usuariosConEsteRol.length > 10) {
      usuariosConEsteRol.splice(10, usuariosConEsteRol.length - 10, "...");
    }

    const rolEmbed = new Discord.EmbedBuilder()
      .setTitle(`Rolinfo: ${rol.name}`)
      .addFields({ name: "▸ 📃 Info", value: `>>> **Nombre:** ${rol.name}\n**ID:** ${rol.id}\n**Posición:** ${rol.rawPosition}\n**Color hex:** ${rol.hexColor}\n**Mencionable:** ${trueOrFalse[rol.mentionable]}\n**Visible en la lista:** ${trueOrFalse[rol.hoist]}` })
      .addFields({ name: "▸ 🔰 Permisos", value: `>>> \`${permisos}\`` })
      .addFields({ name: `▸ 📜 Usuarios (${rol.members.size})`, value: `>>> ${usuariosConEsteRol.join(", ")}` })
      .setColor(rol.hexColor);

    message.reply({ embeds: [rolEmbed] });
  }
}