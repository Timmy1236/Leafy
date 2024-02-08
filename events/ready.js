module.exports = async (client) => {
  const gradient = require('gradient-string');
  const Discord = require('discord.js');
  const config = require('../config.json');

  // Un ASCII art (:]) y un aviso de que el bot está listo.
  console.log(gradient('orange', 'red')("\r\n\u2588\u2588\u2557     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557   \u2588\u2588\u2557\r\n\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u255A\u2588\u2588\u2557 \u2588\u2588\u2554\u255D\r\n\u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557   \u255A\u2588\u2588\u2588\u2588\u2554\u255D \r\n\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D    \u255A\u2588\u2588\u2554\u255D  \r\n\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551        \u2588\u2588\u2551   \r\n\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D        \u255A\u2550\u255D   \r\n                                         \r\n"))
  console.log(gradient.fruit("Bot> Listo!"))

  // Un array de mensajes que aparecerán aleatoriamente en el estado del bot.
  const activities = [
    "Hola!",
    config.BOT.PREFIX + "help",
    "🍊",
    "🍁",
    // Puedes agregar mas activities.
  ];

  // Un loop de 60 segundos que cambiará el estado del bot todo el rato.
  setInterval(() => {
    const randomIndex = Math.floor(Math.random() * activities.length);
    const newActivity = activities[randomIndex];

    client.user.setPresence({ activities: [{ name: newActivity, type: Discord.ActivityType.CustomStatus }], status: 'online' })
  }, 60_000);
}