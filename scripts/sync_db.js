const User = require('../db/models/user');
const Server = require('../db/models/server');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('¿Estas seguro de que deseas sincronizar la base de datos? Esto podría causar perdidas de datos ya almacenadas. (si/no): ', (answer) => {
  if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
    syncDatabase();
  } else {
    console.log('Sincronización de la base de datos cancelada.');
  }

  rl.close();
});

async function syncDatabase() {
  try {
    console.log("\nComenzando la sincronización de la base de datos...");
    console.log("Sincronizando: 'User'");
    await User.sync({ alter: true });

    console.log("Sincronizando: 'Server'");
    await Server.sync({ alter: true });

    console.log("\nSincronización completa. Ya puedes iniciar el bot.");
    console.log("Recordatorio: Solo debes de volver a sincronizar la base de datos cuando realices cambios en los modelos.");
  } catch (error) {
    console.log("¡Error al sincronizar la base de datos!");
    console.error(error);
    process.exit(1);
  }
}