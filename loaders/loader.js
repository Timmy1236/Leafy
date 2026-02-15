const fs = require('fs');
const path = require('path');

module.exports = client => {
  const folderPath = path.join(__dirname, '..', 'loaders');
  const loaders = fs.readdirSync(folderPath).filter((file) => file.endsWith(".js"));
  const loadersFiltered = loaders.filter(file => file !== "loader.js") // Quitamos "loader.js" de la lista para no ejecutarlo infinitamente.

  for (var loader of loadersFiltered) {
    const loaderPath = path.join(folderPath, loader)
    console.log(`\x1b[0;92mbot/loaders/loader.js>\x1b[0m Ejecutando loader: ${loader}`);
    require(loaderPath)(client);
  }
  console.log(`\x1b[0;92mbot/loaders/loader.js>\x1b[0m Listo!`);
}