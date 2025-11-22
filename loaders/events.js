const fs = require("fs");

module.exports = client => {
  try {
    const table = [];
    const events = fs.readdirSync("./events/").filter((file) => file.endsWith(".js"));

    for (var file of events) {
      let fileContents = require(`../events/${file}`);
      let fileName = file.substring(0, file.length - 3);

      client.on(fileName, fileContents.bind(null, client));
      table.push({ Evento: fileName, Estado: "LISTO!" });
    }

    console.table(table);
  } catch (error) {
    console.log(`\x1b[0;31mbot/loaders/events.js>\x1b[0m Error!`);
    console.error(error);
  }
};