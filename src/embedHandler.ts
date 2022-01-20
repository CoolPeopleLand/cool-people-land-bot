import {MessageEmbedOptions, TextChannel} from "discord.js";
import {Plugin} from "./storage.js";
import {config} from "./config.js";


export async function updateEmbeds(channel: TextChannel) {
	console.log("Updating embeds")
	const messages = await channel.messages.fetch({limit: 10})
	const msg = messages.find(x => x.author.id == channel.client?.user?.id)

	const content = {embeds: await createEmbeds(), content: "** **"}

	if (msg) await msg.edit(content)
	else await channel.send(content)
}

export async function createEmbeds(): Promise<MessageEmbedOptions[]> {
	const plugins = await Plugin.findAll();
	return plugins.map(x => <MessageEmbedOptions>{
		title: x.get("name"),
		description: `Version **${x.get("currentVersion")}** by <@${x.get("developerUserId")}>
		<${x.get("downloadUrl")}>`,
		timestamp: new Date(),
		color: config.developers[x.get("developerUserId") as string].color
	})
}