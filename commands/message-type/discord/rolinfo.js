module.exports = {
  nombre: "rolinfo",
  alias: ["roleinfo"],
  descripcion: "Muestra información sobre un rol.",
  categoria: "Discord",
  tieneHelp: 0,
  run: async (Discord, client, message, prefix, args, bot) => {
    const rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(role => role.name === args.slice(1).join(" "));

    if (!rol) return message.reply({ content: `❌ | Debes de mencionar un rol o añadir su id.` });

    const permisos = rol.permissions.toArray().join('\`, \`');

    let trueOrFalse = {
      'true': 'Sí',
      'false': 'No'
    }

    const rolEmbed = new Discord.EmbedBuilder()
      .setTitle(`Rolinfo: ${rol.name}`)
      .addFields({ name: "▸ 📃 Info", value: `>>> **Nombre:** ${rol.name}\n**ID:** ${rol.id}\n**Posición:** ${rol.rawPosition}\n**Color hex:** ${rol.hexColor}\n**Mencionable:** ${trueOrFalse[rol.mentionable]}\n**Visible en la lista:** ${trueOrFalse[rol.hoist]}\n**Usuarios:** ${rol.members.size}` })
      .addFields({ name: "▸ 🔰 Permisos", value: `>>> \`${permisos}\`` })
      .setColor(rol.hexColor);

    message.reply({ embeds: [rolEmbed] });
  }
}