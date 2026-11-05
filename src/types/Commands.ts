import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import { LeafyClient } from "./Client.js";
import { UserAttributes, ServerAttributes } from "../types/Database.js";

export interface SlashCommand {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder | SlashCommandOptionsOnlyBuilder
  categoria: string
  run: (
    client: LeafyClient,
    interaction: ChatInputCommandInteraction<"cached">,
    userDB: UserAttributes,
    serverDB: ServerAttributes
  ) => Promise<void>
}
