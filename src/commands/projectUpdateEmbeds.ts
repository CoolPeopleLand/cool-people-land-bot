import {Subcommand} from "./command.js";
import {SlashCommandSubcommandBuilder} from "@discordjs/builders";
import {CommandInteraction, TextChannel} from "discord.js";
import {updateEmbeds} from "../embedHandler.js";
import {config} from "../config.js";

export const projectUpdateEmbeds: Subcommand = {
	info: new SlashCommandSubcommandBuilder()
		.setName("embeds")
		.setDescription("Updates embeds"),

	async execute(interaction: CommandInteraction): Promise<void> {
		await updateEmbeds(await interaction.client.channels.fetch(config.pluginListChannel) as TextChannel)
		await interaction.reply({content: "Done", ephemeral: true})
	}
}

