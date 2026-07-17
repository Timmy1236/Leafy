import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import { LeafyClient } from "../types/Client.js";

type LoaderModule = { default: (client: LeafyClient) => Promise<void> };

export default async (client: LeafyClient) => {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);
	const folderPath = path.join(__dirname, "..", "loaders");
	const loaders = fs.readdirSync(folderPath).filter((file: string) => file.endsWith(".js"));
	const loadersFiltered = loaders.filter((file: string) => file !== "loader.js");

	for (const loader of loadersFiltered) {
		const loaderPath = path.join(folderPath, loader);
		console.log(`\x1b[0;92mbot/loaders/loader.js>\x1b[0m Ejecutando loader: ${loader}`);

		const imported = await import(pathToFileURL(loaderPath).href) as LoaderModule;
		await imported.default(client);
	}
	console.log("\x1b[0;92mbot/loaders/loader.js>\x1b[0m Listo!");
};