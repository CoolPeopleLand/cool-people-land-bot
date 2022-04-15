import {Client, Intents, Snowflake, TextChannel} from "discord.js";
import {config} from "./config.js";
import {initStorage} from "./storage.js";
import {updateEmbeds} from "./embedHandler.js";
import {rolesCommand} from "./commands/roles.js";
import {setupXp} from "./xp.js";
import {xpCommand} from "./commands/xp.js";
import {xpAddCommand} from "./commands/xp/xpAdd.js";
import {xpLeaderboardCommand} from "./commands/xp/xpLeaderboard.js";
import {Command, CommandManager} from "djs-slash-helper";
import {projectRoot} from './commands/project/projectRoot.js'

const token: Snowflake = process.env.BOT_TOKEN || "";

if (token == "") {
	console.log("No token set!")
	process.exit()
}

const commands: Command<any>[] = [
	projectRoot,
	rolesCommand,
	xpCommand,
	xpAddCommand,
	xpLeaderboardCommand
]

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
const commandManager = new CommandManager(commands, client)

async function init() {
	// init database
	console.log("Initialising database")
	await initStorage()

	// login
	await client.login(token);
	console.log("Logged in")

	await setupXp(client);

	const guild = await client.guilds.fetch(config.guildId)

	await commandManager.setupForGuild(config.clientId, guild.id)

	console.log("Ready")

	await updateEmbeds(await guild.channels.fetch(config.pluginListChannel) as TextChannel)
}

init()