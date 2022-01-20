import {Command} from "./command.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";
import {Plugin} from "../storage.js";

export const rolesCommand: Command = {
	info: new SlashCommandBuilder()
		.setName("role")
		.setDescription("Add or remove yourself from a role")
		.addRoleOption(x => x.setName("role")
			.setDescription("The role to add")
			.setRequired(true)
		),

	async execute(interaction: CommandInteraction) {

		const role = await interaction.options.get("role")!.role!
		const plugins = await Plugin.findAll({
			where: {announcementRole: role.id}
		})

		if (!plugins.length) {
			await interaction.reply("Sorry, you can't get that role.")
			return
		}

		const member = await (interaction.guild?.members.fetch(interaction.user))
		if (!member) return;


		const willRemove = member.roles.cache.has(role.id);

		await member.roles[willRemove ? "remove" : "add"](role.id);


		await interaction.reply(`You were ${willRemove ? "removed from" : "added to"} the role ${role.name}`)
	}
}