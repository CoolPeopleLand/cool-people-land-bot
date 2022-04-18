import {Plugin} from "../../storage.js";
import {CommandInteraction, TextChannel} from "discord.js";
import {updateEmbeds} from "../../embedHandler.js";
import {config} from "../../config.js";
import {ApplicationCommandOptionType} from 'discord-api-types/v10'
import { ExecutableSubcommand } from "djs-slash-helper";

export const projectDelete : ExecutableSubcommand = {
	type: ApplicationCommandOptionType.Subcommand,
	name: "delete",
	description: "Deletes a project",
	options: [{
		type: ApplicationCommandOptionType.String,
		name: "name",
		description: "The project's name",
		required: true
	}],

	async handle(interaction: CommandInteraction) {
		const project = await Plugin.findOne({
			where: {
				name: interaction.options.get("name")?.value
			}
		})

		if (!project) {
			await interaction.reply({content: "Couldn't find a project with that name!", ephemeral: true})
			return
		}

		if (interaction.user.id !== project?.get("developerUserId")) {
			await interaction.reply({content: "That's not your project!", ephemeral: true})
			return
		}

		try {
			const channel = await interaction.guild?.channels.fetch(project.get("helpChannel") as string)
			await channel?.delete()
		} catch (_) {}

		try {
			const role = await interaction.guild?.roles.fetch(project.get("announcementRole") as string)
			await role?.delete()
		} catch (_) {}

		await Plugin.destroy({where: {name: project.get("name") as string}})

		await updateEmbeds(await interaction.client.channels.fetch(config.pluginListChannel) as TextChannel)
		await interaction.reply({content: "Project deleted", ephemeral: true})
	}
}