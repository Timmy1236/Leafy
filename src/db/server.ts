import db from "./database.js";
import { ServerAttributes } from "../types/Database.js";

db.prepare(`
  CREATE TABLE IF NOT EXISTS servers (
    id TEXT PRIMARY KEY,
    welcomeChannel TEXT
  )
`).run();

export function getServer(id: string): ServerAttributes | undefined {
  return db.prepare("SELECT * FROM servers WHERE id = ?").get(id) as ServerAttributes | undefined;
}

export function getServerOrCreate(id: string): ServerAttributes {
  const existing = getServer(id);
  if (existing) return existing;

  db.prepare("INSERT INTO servers (id) VALUES (?)").run(id);
  return getServer(id)!;
}

export function saveServer(server: ServerAttributes): void {
  db.prepare(`
    UPDATE servers
    SET welcomeChannel = ?
    WHERE id = ?
  `).run(server.welcomeChannel, server.id);
}
