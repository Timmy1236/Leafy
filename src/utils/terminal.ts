import { createInterface } from "node:readline";
import { LeafyClient } from "../types/Client.js";

export default function startTerminal(client: LeafyClient) {
  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "> "
  });

  console.log("Consola lista. Escribe /help para ver los comandos disponibles.");
  terminal.prompt();

  terminal.on("line", (input) => {
    const command = input.trim().toLowerCase();

    switch (command) {
      case "/help":
        console.log("Comandos disponibles: /help, /exit");
        terminal.prompt();
        break;
      case "/exit":
        console.log("Cerrando el bot...");
        terminal.close();
        client.destroy();
        break;
      default:
        console.log(`Comando desconocido: ${input}. Escribe /help para ver los comandos disponibles.`);
        terminal.prompt();
    }
  });
}
