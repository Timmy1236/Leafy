import User from '../db/models/user.js';
import Server from '../db/models/server.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('¿Estas seguro de que deseas sincronizar la base de datos? (si/no): ', (answer) => {
  if (answer.toLowerCase() === 's' || answer.toLowerCase() === 'si') {
    syncDatabase();
  } else {
    console.log('Sincronización cancelada.');
  }
  rl.close();
});

async function syncDatabase() {
  try {
    console.log("\nComenzando la sincronización...");
    console.log("Sincronizando: 'User'");
    await User.sync({ alter: true });

    console.log("Sincronizando: 'Server'");
    await Server.sync({ alter: true });

    console.log("\nSincronización completa.");
  } catch (error) {
    console.log("¡Error al sincronizar!");
    console.error(error);
    process.exit(1);
  }
}