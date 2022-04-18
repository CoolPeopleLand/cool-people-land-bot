import {config} from "../../config.js";
import {Plugin} from "../../storage.js";
import {CommandInteraction, Guild, TextChannel} from "discord.js";
import {updateEmbeds} from "../../embedHandler.js";
import {ApplicationCommandOptionType} from 'discord-api-types/v10'
import {ExecutableSubcommand} from "djs-slash-helper";

export const projectAdd: ExecutableSubcommand = {
	type: ApplicationCommandOptionType.Subcommand,
	name: "create",
	description: "Create a new project",
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'name',
			description: "The project's name",
			required: true
		},
		{
			type: ApplicationCommandOptionType.String,
			name: 'description',
			description: "A short description of the project",
			required: true
		},
		{
			type: ApplicationCommandOptionType.String,
			name: 'version',
			description: "The project's current version",
			required: true
		},
		{
			type: ApplicationCommandOptionType.String,
			name: 'url',
			description: "The project's download URL",
			required: true
		}],

	async handle(interaction: CommandInteraction): Promise<void> {
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
