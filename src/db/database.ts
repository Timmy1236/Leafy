import Database from "better-sqlite3";
import fs from "fs";

if (!fs.existsSync("db")) {
	fs.mkdirSync("db");
}

const db = new Database("db/database.sqlite");

db.pragma("journal_mode = WAL"); // https://sqlite.org/wal.html
db.pragma("foreign_keys = ON"); // Activa llaves foráneas

export default db;