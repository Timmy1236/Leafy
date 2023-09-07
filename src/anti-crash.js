const config = require('../config.json');
const gradient = require('gradient-string');
function AntiCrash() {
  if (config.BOT.ANTI_CRASH == true) {
    process.on('unhandledRejection', (reason, promise) => {
      console.log(gradient('orange', 'red')('Bot> Error!'));
      console.error(`\x1b[31m${reason}\x1b[0m`);
      console.log(gradient('orange', 'red')('Bot> Seguiré prendido, pero posiblemente no funcione correctamente.'));
    });
    process.on('rejectionHandled', (promise) => {
      console.log(gradient('orange', 'red')('Bot> Error!'));
      console.error(`\x1b[31m${promise}\x1b[0m`);
      console.log(gradient('orange', 'red')('Bot> Seguiré prendido, pero posiblemente no funcione correctamente.'));
    })
    process.on("uncaughtException", (err, origin) => {
      console.log(gradient('orange', 'red')('Bot> Error!'));
      console.error(`\x1b[31m${err}\x1b[0m`);
      console.log(gradient('orange', 'red')('Bot> Seguiré prendido, pero posiblemente no funcione correctamente.'));
    });
  }
}
module.exports = {
  AntiCrash,
};