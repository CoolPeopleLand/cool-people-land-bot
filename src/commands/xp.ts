import {Command} from "./command.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, GuildMember} from "discord.js";
import {User} from "../storage.js";
import {xpForLevel} from "../xp.js";

export const xpCommand: Command = {
	info: new SlashCommandBuilder()
		.setName("xp")
		.setDescription("Shows your current XP")
		.addUserOption(x => x.setName("user").setDescription("The user to show XP")),

	async execute(interaction: CommandInteraction) {

		const target = interaction.options.get("user")?.user || interaction.user

		const user = await User.findOne({where: {id: target.id}})
		const xp = (user?.get("xp") || 0) as number
		const level = (user?.get("level") || 0) as number

		const xpToNext = xpForLevel(level)

		await interaction.reply(`${(interaction.member as GuildMember).displayName} has **${user?.get("xp") || 0}** XP 
Level **${user?.get("level") || 0}** - **${xpToNext - xp} XP** to next level`)
	}
}