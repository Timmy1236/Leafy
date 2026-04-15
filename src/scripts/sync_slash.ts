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
  console.log("--------------- [ Menú ] ---------------");
  console.log("1) Actualizar slash al servidor de test");
  console.log("2) Actualizar slash a todos los servidores");
  console.log("3) Información");
  console.log("4) Cancelar");
  console.log("----------------------------------------");

  rl.question("Opción: ", async (op: string) => {
    switch (op) {
      case "1":
        await updateGuild();
        break;
      case "2":
        await updateGlobal();
        break;
      case "3":
        console.log("\nInfo:");
        console.log("- Los slash commands son unos comandos especiales que se integran en la interfaz de Discord, para que esto funcione, tendremos que enviarles una lista de comandos a la API de discord, para esto, tendremos 2 opciones...");
        console.log("- Opción 1: Enviamos la lista a Discord para que solo lo aplique a un servidor, esto es perfecto para testear un nuevo comando sin modificar los demás servidores.");
        console.log("- Opción 2: Enviamos la lista a Discord para que lo aplique a TODOS los servidores que se encuentre el bot, esto puede tardar muchísimo, ya que se tiene que actualizar para cada servidor.");
        mostrarMenu();
        break;
      default:
        console.log("Cancelado.");
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

async function updateGuild() {
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    const commands = leerComandos();

    console.log(`Actualizando los slash commands al servidor: ${GUILD_ID} ...`);
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
    const commands = leerComandos();

    console.log("\nActualizando comandos globales...");
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log("Comandos globales actualizados.");
    console.log("Nota: Puede tardar un tiempo en ver los comandos actualizados en los servidores.");
  } catch (err) {
    console.error("Error:", err);
  }
}