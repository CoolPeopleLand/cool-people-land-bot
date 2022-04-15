import {Command} from "djs-slash-helper"
import {CommandInteraction} from "discord.js";
import {User} from "../../storage.js";
import {ApplicationCommandType} from 'discord-api-types/v10'

export const xpLeaderboardCommand: Command<ApplicationCommandType.ChatInput> = {
	name: "leaderboard",
	description: "Show the XP leaderboard",
	type: ApplicationCommandType.ChatInput,
	permissions: [],
	options: [],

	async handle(interaction: CommandInteraction) {
		const leaderboard = await User.findAll({
			limit: 10,
			order: [["level", "DESC"], ["xp", "DESC"]]
		});

		await interaction.reply({
			embeds: [{
				title: "Leaderboard",
				description: leaderboard.map((x, count) => `#${count + 1}: <@${x.get("id")}>, Level **${x.get("level")}**, **${x.get("xp")}** XP`
				).join("\n")
			}]
		});
	}
}