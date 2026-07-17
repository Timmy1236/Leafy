import fs from "fs";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import { LeafyClient } from "../types/Client.js";
import { Event } from "../types/Events.js";

const logTable: { Evento: string, Estado: string }[] = [];

type EventModule = { default: Event<keyof import("discord.js").ClientEvents> };

export default async (client: LeafyClient) => {
	try {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const eventsPath = path.join(__dirname, "..", "events");
		const events = fs.readdirSync(eventsPath).filter((file: string) => file.endsWith(".js"));

		for (const event of events) {
			const eventPath = path.join(eventsPath, event);
			const eventLoaded = await import(pathToFileURL(eventPath).href) as EventModule;
			const eventImport = eventLoaded.default;

			if (eventImport.once) {
				client.once(eventImport.name, (...args) => {
					eventImport.execute(client, ...args)?.catch((err) => {
						console.error(`Error en el evento once (${eventImport.name}): `, err);
					});
				});
			}
			else {
				client.on(eventImport.name, (...args) => {
					eventImport.execute(client, ...args)?.catch((err) => {
						console.error(`Error en el evento on (${eventImport.name}): `, err);
					});
				});
			}

			logTable.push({ Evento: eventImport.name, Estado: "CARGADO" });
		}
		console.table(logTable);
	}
	catch (error) {
		console.log("\x1b[0;31mbot/loaders/events.js>\x1b[0m Error!");
		console.error(error);
	}
};