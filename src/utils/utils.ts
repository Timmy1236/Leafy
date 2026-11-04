/*
  Cositas generales que no son necesarias para el funcionamiento en algo en especifico.
*/

export function boolToSpanish(value: boolean) {
  return value ? "Sí" : "No";
}

export function isValidSnowflake(id: string) {
  const snowflakeRegex = /^[0-9]{17,19}$/;
  return snowflakeRegex.test(id);
}

export function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "UTC"
  }).format(date);
}

export default { boolToSpanish, isValidSnowflake, formatDateLong };
