import {CommandInteraction, TextChannel} from "discord.js";
import {updateEmbeds} from "../../embedHandler.js";
import {config} from "../../config.js";
import { ExecutableSubcommand } from "djs-slash-helper";
import {ApplicationCommandOptionType} from 'discord-api-types/v10'

export const projectUpdateEmbeds: ExecutableSubcommand = {
	type: ApplicationCommandOptionType.Subcommand,
	name: "embeds",
	description: "Updates embeds",
	async handle(interaction: CommandInteraction): Promise<void> {
		await updateEmbeds(await interaction.client.channels.fetch(config.pluginListChannel) as TextChannel)
		await interaction.reply({content: "Done", ephemeral: true})
	}
}