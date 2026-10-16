import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import { LeafyClient } from "../types/Client.js";
import { cLog } from "../utils/cLog.js";

type LoaderModule = { default: (client: LeafyClient) => Promise<void> };

export default async (client: LeafyClient) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const folderPath = path.join(__dirname, "..", "loaders");
  const loaders = fs.readdirSync(folderPath).filter((file: string) => file.endsWith(".js"));
  const loadersFiltered = loaders.filter((file: string) => file !== "loader.js");

  for (const loader of loadersFiltered) {
    const loaderPath = path.join(folderPath, loader);
    cLog("INFO", `Ejecutando: ${loader}`);

    const imported = await import(pathToFileURL(loaderPath).href) as LoaderModule;
    await imported.default(client);
  }
  cLog("INFO", "Listo!");
};
