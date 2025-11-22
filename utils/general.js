/*
  Cositas generales que no son necesarias para el funcionamiento en algo en especifico.
*/

const moment = require("moment");

moment.updateLocale("es", {
  months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
  weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_")
});

function boolToSpanish(value) {
  return value ? "Sí" : "No";
}

function isValidSnowflake(id) {
  const snowflakeRegex = /^[0-9]{17,19}$/;
  return snowflakeRegex.test(id);
}

module.exports = { moment, boolToSpanish, isValidSnowflake };