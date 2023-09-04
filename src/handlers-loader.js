const fs = require('fs');
const path = require('path');

module.exports = client => {
  const handlersFolderPath = path.join(__dirname, '..', 'handlers');

  fs.readdir(handlersFolderPath, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta "handlers":', err);
      return;
    }

    const handlers = files
      .filter(file => fs.statSync(path.join(handlersFolderPath, file)).isFile())
      .map(file => path.parse(file).name);

    handlers.forEach(handler => {
      require(`../handlers/${handler}`)(client);
    })
  });
}