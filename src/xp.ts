import {Client, Message, Snowflake, TextChannel} from "discord.js";
import {User} from "./storage.js";
import {config} from "./config.js";

// todo - make this function good
const shouldCountForXp = (message: Message) => !message.author.bot && message.content.length > 5;

export const xpForLevel = (level: number) => Math.ceil(34 + level ** (5 / 2))

let messageChannel: TextChannel;

export async function giveXp(userId: Snowflake, xpToAdd: number) {
	const user = await User.findOne({where: {id: userId}})

	let xp = user?.get("xp") as number || 0
	let level = user?.get("level") as number || 0

	xp += xpToAdd
	for (let x = xpForLevel(level); xp >= x; xp -= x) level++;

	if (level !== 0 && level !== user?.get("level") as number) {
		await messageChannel.send(`<@${userId}>, you are now level ${level}!`)
	}

	await User.upsert({
		id: userId,
		xp: xp,
		level: level
	})
}

export async function setupXp(client: Client) {
	messageChannel = await client.channels.fetch(config.botCommandsChannel) as TextChannel
	client.on("messageCreate", async msg => {
		if (shouldCountForXp(msg))
			await giveXp(msg.author.id, Math.ceil(Math.random() * 3) + 2)
	})
}