import fs from "fs";
import path from 'path';
import { LeafyClient } from "../types/Client.js";
import { fileURLToPath, pathToFileURL } from 'url'; // <-- agregar esto
import { Collection } from "discord.js";

const logTable: { Comando: string; Estado: string }[] = [];

export default async (client: LeafyClient) => {
  try {
    client.slashCommands = new Collection();

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const folderPath = path.join(__dirname, "..", "commands");

    const folders = fs.readdirSync(folderPath);

    for (const folder of folders) {
      const categorysPath = path.join(folderPath, folder);
      const slashs = fs.readdirSync(categorysPath).filter(file => file.endsWith(".js"));

      for (const slash of slashs) {
        const slashPath = path.join(categorysPath, slash);
        const slashLoaded = await import(pathToFileURL(slashPath).href);

        const commandData = slashLoaded.default || slashLoaded;

        client.slashCommands.set(commandData.data.name, commandData);

        logTable.push({ Comando: commandData.data.name, Estado: "CARGADO" });
      }
    }

    console.table(logTable);
  } catch (error) {
    console.log(`\x1b[0;31mbot/loaders/slash.js>\x1b[0m Error!`);
    console.error(error);
  }
};
