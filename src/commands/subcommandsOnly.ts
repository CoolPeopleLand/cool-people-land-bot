import {Command, Subcommand} from "./command.js";
import {ApplicationCommand, CommandInteraction, Snowflake} from "discord.js";
import {SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder} from '@discordjs/builders';

export class SubcommandsOnlyCommand implements Command {

	readonly info;
	readonly role;
	readonly subcommands;

	constructor(name: string, description: string, role: Snowflake | undefined, ...subcommands: Subcommand[]) {
		let info: SlashCommandSubcommandsOnlyBuilder = new SlashCommandBuilder()
			.setName(name)
			.setDescription(description)
			.setDefaultPermission(!role);

		for (let subcmd of subcommands) {
			info = info.addSubcommand(subcmd.info);
		}
		this.info = info;
		this.role = role;
		this.subcommands = subcommands;
	}


	async init(command: ApplicationCommand) {
		if (this.role) await command.permissions.add({
			permissions: [{
				id: this.role,
				type: "ROLE",
				permission: true
			}]
		})
	}

	async execute(interaction: CommandInteraction): Promise<void> {
		this.subcommands.find(sub => sub.info.name == interaction.options.getSubcommand())!.execute(interaction)
	}
}