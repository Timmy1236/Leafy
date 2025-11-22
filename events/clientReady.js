module.exports = async (client) => {
  const Discord = require('discord.js');
  const config = require('../config.json');

  console.log("\x1b[0;92mbot/events/ready.js>\x1b[0m El bot se encuentra encendido y conectado a Discord.");
  // ↓ Ascii art
  console.log("\x1b[0;92m\r\n\u2588\u2588\u2557     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557   \u2588\u2588\u2557\r\n\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2588\u2588\u2557 \u2588\u2588\u2554\u255D\r\n\u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557   \u255A\u2588\u2588\u2588\u2588\u2554\u255D \r\n\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D    \u255A\u2588\u2588\u2554\u255D  \r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551        \u2588\u2588\u2551   \r\n\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D        \u255A\u2550\u255D   \r\n\x1b[0m")

  console.timeEnd("Tiempo de carga");

  // Un array de textos para el estado del bot, aparecerá uno cada 60 segundos.
  const activities = [
    config.BOT.PREFIX + "help",
    "/help",
    "Hola!",
    "ᨒ↟ 𖠰𖥧˚",
    "🪴",
    "🌿"
  ];

  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    const newActivity = activities[randomIndex];

    client.user.setPresence({ activities: [{ name: newActivity, type: Discord.ActivityType.CustomStatus }], status: 'online' })
  }, 60_000);
}