import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { LeafyClient } from "./Client.js";
import User from "../db/models/user.js";
import Server from "../db/models/server.js";

export interface SlashCommand {
  data: SlashCommandBuilder;
  categoria: string;
  permisos?: string[];
  run: (
    client: LeafyClient,
    interaction: ChatInputCommandInteraction,
    userDB?: InstanceType<typeof User>,
    serverDB?: InstanceType<typeof Server>
  ) => Promise<void>;
}