const fs = require("fs");
const path = require('path');
const logTable = [];

module.exports = client => {
  try {
    const eventsPath = path.join(__dirname, "..", "events") // Ruta: Leafy/events
    const events = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js")); // Los eventos, no hay categorías.

    for (var event of events) {
      const eventPath = path.join(eventsPath, event) // La ruta de un evento
      const eventLoaded = require(eventPath);
      const eventParsed = path.parse(eventPath)

      client.on(eventParsed.name, eventLoaded.bind(null, client));
      logTable.push({ Evento: eventParsed.name, Estado: "CARGADO" });
    }
    console.table(logTable);
  } catch (error) {
    console.log(`\x1b[0;31mbot/loaders/events.js>\x1b[0m Error!`);
    console.error(error);
  }
};