import { CommandInteraction} from "discord.js";
import {User} from "../storage.js";
import {xpForLevel} from "../xp.js";
import {Command} from "djs-slash-helper";
import {ApplicationCommandType, ApplicationCommandOptionType} from 'discord-api-types/v10'

export const xpCommand: Command<ApplicationCommandType.ChatInput> = {
	type: ApplicationCommandType.ChatInput,
	name: "xp",
	description: "Shows your current XP",
	options: [{
		name: "user",
		description: "The user to show XP",
		type: ApplicationCommandOptionType.User
	}],
	permissions: [],

	async handle(interaction: CommandInteraction) {

		const target = interaction.options.get("user")?.user || interaction.user

		const user = await User.findOne({where: {id: target.id}})
		const xp = (user?.get("xp") || 0) as number
		const level = (user?.get("level") || 0) as number

		const xpToNext = xpForLevel(level)

		await interaction.reply(`${target.username} has **${user?.get("xp") || 0}** XP 
Level **${user?.get("level") || 0}** - **${xpToNext - xp} XP** to next level`)
	}
}