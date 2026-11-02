import { LeafyClient } from "../types/Client.js";
import events from "./events.js";
import slash from "./slash.js";

export default async (client: LeafyClient) => {
  await events(client);
  await slash(client);
};
