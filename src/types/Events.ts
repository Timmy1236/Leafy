import { LeafyClient } from "./Client.js";
import { ClientEvents } from "discord.js";

export interface Event<K extends keyof ClientEvents> {
	name: K
	once?: boolean
	execute: (client: LeafyClient, ...args: ClientEvents[K]) => void | Promise<void>
}