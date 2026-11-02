import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { LeafyClient } from "./Client.js";
import { UserAttributes, ServerAttributes } from "../types/Database.js";

export interface SlashCommand {
  data: SlashCommandBuilder
  categoria: string
  run: (
    client: LeafyClient,
    interaction: ChatInputCommandInteraction,
    userDB?: UserAttributes,
    serverDB?: ServerAttributes
  ) => Promise<void>
}
