import {Subcommand} from "./command.js";
import {config} from "../config.js";
import {Plugin} from "../storage.js";
import {CommandInteraction, Guild, TextChannel} from "discord.js";
import {SlashCommandSubcommandBuilder} from "@discordjs/builders";
import {updateEmbeds} from "../embedHandler.js";

export const projectAdd: Subcommand = {

	info: new SlashCommandSubcommandBuilder()
		.setName("create")
		.setDescription("Create a new project")
		.addStringOption(opt => opt.setName("name")
			.setDescription("The project's name")
			.setRequired(true)
		)
		.addStringOption(opt => opt.setName("description")
			.setDescription("A short description of the project")
			.setRequired(true)
		)
		.addStringOption(opt => opt.setName("version")
			.setDescription("The project's current version")
			.setRequired(true)
		)
		.addStringOption(opt => opt.setName("url")
			.setDescription("The project's download URL")
			.setRequired(true)
		),

	async execute(interaction: CommandInteraction): Promise<void> {
		const name: string = interaction.options.get("name")?.value as string
		const guild = await interaction.client.guilds.cache.get(config.guildId) as Guild

		const chan = await guild.channels.create(name, {
			parent: config.developers[interaction.user.id].category
		});

		const role = await guild.roles.create({
			name: `${name} Announcements`,
			permissions: BigInt(0)
		})

		await Plugin.create({
			name: name,
			description: interaction.options.get("description")?.value,
			currentVersion: interaction.options.get("version")?.value,
			downloadUrl: interaction.options.get("url")?.value,
			developerUserId: interaction.user.id,
			announcementRole: role.id,
			helpChannel: chan.id
		})

		await interaction.reply({content: "Plugin created", ephemeral: true})

		await updateEmbeds(await guild.channels.fetch(config.pluginListChannel) as TextChannel)
	}
}