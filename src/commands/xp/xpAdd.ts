import {Command} from "../command";
import {SlashCommandBuilder} from "@discordjs/builders";
import {ApplicationCommand, CommandInteraction, GuildMember} from "discord.js";
import {config} from "../../config.js";
import {giveXp} from "../../util/xp.js";

export const xpAddCommand: Command = {
	info: new SlashCommandBuilder()
		.setName("xpadd")
		.setDescription("Adds xp to a user")
		.setDefaultPermission(false)
		.addUserOption(x => x.setName("user").setDescription("The user to add xp to").setRequired(true))
		.addNumberOption(x => x.setName("xp").setDescription("How much xp to add").setRequired(true)),

	async init(command: ApplicationCommand) {
		await command.permissions.add({
			permissions: [{
				id: config.developerRole,
				type: "ROLE",
				permission: true
			}]
		})
	},

	async execute(interaction: CommandInteraction) {
		await giveXp(interaction.options.get("user")!.member! as GuildMember, interaction.options.get("xp")!.value as number)
		await interaction.reply("Done")
	}
}