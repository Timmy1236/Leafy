import { Client, Collection, ClientOptions, HexColorString } from "discord.js";
import { SlashCommand } from "./Commands.js";

interface LeafyConfig {
	color: HexColorString
	clientID: string
	ownerID: string
	emojis: Record<string, string>
}

export class LeafyClient extends Client {
	slashCommands: Collection<string, SlashCommand> = new Collection();

	color: HexColorString;
	clientID: string;
	ownerID: string;
	botEmojis: Record<string, string>;

	constructor(options: ClientOptions, config: LeafyConfig) {
		super(options);

		this.color = config.color;
		this.clientID = config.clientID;
		this.ownerID = config.ownerID;
		this.botEmojis = config.emojis;
	}
}