import {Client, Intents, Snowflake, TextChannel} from "discord.js";
import {REST} from "@discordjs/rest";
import {config} from "./config.js";
import {Routes} from "discord-api-types/v9";
import {SubcommandsOnlyCommand} from "./commands/subcommandsOnly.js";
import {projectAdd} from "./commands/project/projectAdd.js";
import {initStorage} from "./storage.js";
import {updateEmbeds} from "./embedHandler.js";
import {projectUpdateEmbeds} from "./commands/project/projectUpdateEmbeds.js";
import {projectUpdate} from "./commands/project/projectUpdate.js";
import {projectDelete} from "./commands/project/projectDelete.js";
import {rolesCommand} from "./commands/roles.js";
import {setupXp} from "./xp.js";
import {xpCommand} from "./commands/xp.js";
import {xpAddCommand} from "./commands/xp/xpAdd.js";
import {xpLeaderboardCommand} from "./commands/xp/xpLeaderboard.js";

const token: Snowflake = process.env.BOT_TOKEN || "";

if (token == "") {
	console.log("No token set!")
	process.exit()
}

const commands = [
	new SubcommandsOnlyCommand("project",
		"Project management for developers",
		config.developerRole,
		projectAdd, projectUpdateEmbeds, projectUpdate, projectDelete),
	rolesCommand,
	xpCommand,
	xpAddCommand,
	xpLeaderboardCommand
]

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return
	const command = commands.find(cmd => cmd.info.name == interaction.commandName)
	if (!command) return
	await command.execute(interaction)
})

async function init() {
	// init database
	console.log("Initialising database")
	await initStorage()

	// register commands
	const rest = new REST({version: '9'}).setToken(token);

	console.log('Registering slash commands');
	await rest.put(
		Routes.applicationGuildCommands(config.clientId, config.guildId),
		{body: commands.map(cmd => cmd.info.toJSON())},
	);
	console.log('Finished registering slash commands');

	// login
	await client.login(token);
	console.log("Logged in")

	await setupXp(client);

	// initialise commands
	const guild = await client.guilds.fetch(config.guildId)
	const slashCommands = await guild.commands.fetch()
	for (const slash of slashCommands) {
		const cmd = commands.find(x => x.info.name == slash[1].name)
		if (!cmd) {
			console.log(`WARNING: could not find command with name ${slash[1].name}`)
		}
		await cmd?.init?.(slash[1])
	}
	console.log("Ready")

	await updateEmbeds(await guild.channels.fetch(config.pluginListChannel) as TextChannel)
}

init()