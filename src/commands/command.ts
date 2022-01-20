import {ApplicationCommand, CommandInteraction} from "discord.js";
import {SlashCommandSubcommandBuilder} from "@discordjs/builders";

export interface Command {
	info: { name: string, toJSON(): unknown; }

	execute(interaction: CommandInteraction): Promise<void>;

	init?(command: ApplicationCommand): Promise<void>;
}

export interface Subcommand {

	info: SlashCommandSubcommandBuilder;

	execute(interaction: CommandInteraction): Promise<void>;
}