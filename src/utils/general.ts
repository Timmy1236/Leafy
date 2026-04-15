/*
  Cositas generales que no son necesarias para el funcionamiento en algo en especifico.
*/

import moment from 'moment';

moment.updateLocale("es", {
  months: "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
  weekdays: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_")
});

export function boolToSpanish(value: boolean) {
  return value ? "Sí" : "No";
}

export function isValidSnowflake(id: string) {
  const snowflakeRegex = /^[0-9]{17,19}$/;
  return snowflakeRegex.test(id);
}

export default { moment, boolToSpanish, isValidSnowflake };