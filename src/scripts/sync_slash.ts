import fs from "fs";
import { REST, Routes } from "discord.js";
import * as readline from "readline";

import config from "../config.json" with { type: "json" };;
const CLIENT_ID = config.CLIENT_ID;
const TOKEN = config.TOKEN;
const GUILD_ID = config.GUILD_TEST_ID;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mostrarMenu();

function mostrarMenu() {
  // Esto me hace recordar a los menús que hacia en clases de programación xD
  console.log("------------------ [ Menú ] ------------------");
  console.log("1) Actualizar comandos en el servidor de test.");
  console.log("2) Eliminar comandos en el servidor de test.");
  console.log("3) Actualizar comandos en todos los servidores.");
  console.log("4) Eliminar comandos en todos los servidores.");
  console.log("5) Cancelar.");
  console.log("----------------------------------------------");

  rl.question("Opción: ", async (op: string) => {
    switch (op) {
      case "1":
        await updateTestGuild();
        break;
      case "2":
        await clearTestGuild();
        break;
      case "3":
        await updateGlobal();
        break;
      case "4":
        await clearGlobal();
        break;
      case "5":
      default:
        console.log("Cancelado.");
        break;
    }
    rl.close();
  });
}

async function leerComandos() {
  let commandsArray: any[] = [];

  const folders = fs.readdirSync("./dist/commands");

  for (const folder of folders) {
    const files = fs.readdirSync(`./dist/commands/${folder}`)
      .filter(f => f.endsWith(".js"));

    for (const file of files) {
      const slashModule = await import(
        new URL(`../commands/${folder}/${file}`, import.meta.url).href
      );

      const slash = slashModule.default;
      commandsArray.push(slash.data.toJSON());
    }
  }

  return commandsArray;
}

async function updateTestGuild() {
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    const commands = await leerComandos();

    console.log(`Actualizando comandos en el servidor de test: ${GUILD_ID} ...`);
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );

    console.log("Comandos actualizados.");

  } catch (err) {
    console.error("Error:", err);
  }
}

async function updateGlobal() {
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    const commands = await leerComandos();

    console.log("\nActualizando comandos en todos los servidores...");
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("Comandos globales actualizados.");
    console.log("Nota: Puede tardar un tiempo en ver los comandos actualizados en los servidores. Si no sigues viendolos, reiniciar Discord en tu pc.");
  } catch (err) {
    console.error("Error:", err);
  }
}

async function clearTestGuild() {
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    console.log(`Limpiando los slash commands del servidor: ${GUILD_ID} ...`);
    
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: [] }
    );

    console.log("Comandos del servidor de test eliminados.");
  } catch (err) {
    console.error("Error al limpiar el servidor:", err);
  }
}

async function clearGlobal() {
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    console.log("Limpiando los slash commands globales...");
    
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: [] }
    );

    console.log("Comandos globales eliminados.");
    console.log("Nota: Puede tardar un tiempo en ver los comandos actualizados en los servidores. Si no sigues viendolos, reiniciar Discord en tu pc.");
  } catch (err) {
    console.error("Error al limpiar globalmente:", err);
  }
}