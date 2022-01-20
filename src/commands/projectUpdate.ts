import {Subcommand} from "./command.js";
import {SlashCommandSubcommandBuilder} from "@discordjs/builders";
import {CommandInteraction, TextChannel} from "discord.js";
import {Plugin} from "../storage.js";
import {config} from "../config.js";
import {updateEmbeds} from "../embedHandler.js";

export const projectUpdate: Subcommand = {
	info: new SlashCommandSubcommandBuilder()
		.setName("update")
		.setDescription("Set a project's current version")
		.addStringOption(opt => opt.setName("name")
			.setDescription("The project's name")
			.setRequired(true)
		)
		.addStringOption(opt => opt.setName("version")
			.setDescription("The project's new version")
			.setRequired(true)
		)
		.addStringOption(opt => opt.setName("changelog")
			.setDescription("What's changed")
			.setRequired(true)
		),

	async execute(interaction: CommandInteraction): Promise<void> {
		const plugin = await Plugin.findOne({
			where: {
				name: interaction.options.get("name")?.value
			}
		})

		if (!plugin) {
			await interaction.reply({content: "Couldn't find a project with that name!", ephemeral: true})
			return
		}

		if (plugin.get("developerUserId") !== interaction.user.id) {
			await interaction.reply({content: "That's not your project!", ephemeral: true})
			return
		}

		await Plugin.update({version: interaction.options.get("version")?.value}, {
			where: {name: interaction.options.get("name")?.value}
		})

		const announcementChannel = await interaction.client.channels.fetch(config.announcementChannel) as TextChannel
		await announcementChannel.send({
			content: `<@&${plugin.get("announcementRole")}>`,
			embeds: [{
				title: `${plugin.get("name")} version ${interaction.options.get("version")?.value}`,
				description: `A new update has been created for ${plugin.get("name")}.
				
				${interaction.options.get("changelog")?.value}
				
				Get it at **<${plugin.get("downloadUrl")}>**`,
				color: config.developers[plugin.get("developerUserId") as string].color
			}]
		})

		await updateEmbeds(await interaction.client.channels.fetch(config.pluginListChannel) as TextChannel)
		await interaction.reply({content: "Project updated", ephemeral: true})
	}
}
