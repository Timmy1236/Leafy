import db from './database.js';
import { UserAttributes } from '../types/Database.js';

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    commandsCount INTEGER DEFAULT 0
  )
`).run();

export function getUser(id: string): UserAttributes | undefined {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserAttributes | undefined;
}

export function getUserOrCreate(id: string): UserAttributes {
  const existing = getUser(id);
  if (existing) return existing;

  db.prepare('INSERT INTO users (id) VALUES (?)').run(id);
  return getUser(id)!;
}

export function saveUser(user: UserAttributes): void {
  db.prepare(`
    UPDATE users
    SET xp = ?, level = ?, commandsCount = ?
    WHERE id = ?
  `).run(user.xp, user.level, user.commandsCount, user.id);
}