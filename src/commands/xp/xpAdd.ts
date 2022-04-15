import {Command} from "djs-slash-helper"
import {CommandInteraction} from "discord.js";
import {config} from "../../config.js";
import {giveXp} from "../../xp.js";
import {ApplicationCommandOptionType, ApplicationCommandType} from 'discord-api-types/v10'

export const xpAddCommand: Command<ApplicationCommandType.ChatInput> = {
	name: "xpadd",
	description: "Adds xp to a user",
	type: ApplicationCommandType.ChatInput,
	default_permission: false,
	permissions: [{
		id: config.developerRole,
		type: "ROLE",
		permission: true
	}],
	options: [{
		type: ApplicationCommandOptionType.User,
		name: "user",
		description: "The user to add xp for"
	},{
		type: ApplicationCommandOptionType.Number,
		name: "xp",
		description: "How much xp to add"
	}],

	async handle(interaction: CommandInteraction) {
		await giveXp(interaction.options.get("user")!.user!.id, interaction.options.get("xp")!.value as number)
		await interaction.reply("Done")
	}
}

