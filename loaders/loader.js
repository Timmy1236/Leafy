const fs = require('fs');
const path = require('path');

module.exports = client => {
  const folderPath = path.join(__dirname, '..', 'loaders');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta "loaders":', err); // Huh? No se como podría pasar esto en primer lugar.
      return;
    }

    const scripts = files.filter(file => fs.statSync(path.join(folderPath, file)).isFile()).map(file => path.parse(file).name);

    scripts.forEach(script => {
      if (script === 'loader') return;

      console.log(`\x1b[0;92mbot/loaders/loader.js>\x1b[0m Ejecutando el cargador: ${script}.js`);
      require(`../loaders/${script}`)(client);
    })

    console.log(`\x1b[0;92mbot/loaders/loader.js>\x1b[0m Listo!`);
  });
}