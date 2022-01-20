import {Command} from "../command.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import {User} from "../../storage.js";

export const xpLeaderboardCommand: Command = {
	info: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Show the XP leaderboard"),

	async execute(interaction: CommandInteraction) {
		const leaderboard = await User.findAll({
			limit: 10,
			order: [["level", "DESC"], ["xp", "DESC"]]
		})

		await interaction.reply({
			embeds: [{
				title: "Leaderboard",
				description: leaderboard.map((x, count) =>
					`#${count + 1}: <@${x.get("id")}>, Level **${x.get("level")}**, **${x.get("xp")}** XP`
				).join("\n")
			}]
		})
	}
}