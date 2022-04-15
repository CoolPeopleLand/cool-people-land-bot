import {CommandInteraction} from "discord.js";
import {Plugin} from "../storage.js";
import {Command} from "djs-slash-helper"
import {ApplicationCommandType, ApplicationCommandOptionType} from 'discord-api-types/v10'

export const rolesCommand: Command<ApplicationCommandType.ChatInput> = {
	name: "role",
	description: "Add or remove yourself from a role",
	type: ApplicationCommandType.ChatInput,
	options: [{
		name: "role",
		description: "The role to add",
		type: ApplicationCommandOptionType.Role
	}],
	permissions: [],

	async handle(interaction: CommandInteraction) {
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