import {Client, GuildMember, Message, TextChannel} from "discord.js";
import {User} from "../storage.js";
import {config} from "../config.js";
import {setupEmbed} from "./mention.js";

// todo - make this function good
const shouldCountForXp = (message: Message) => !message.author.bot && message.content.length > 5;

export const xpForLevel = (level: number) => Math.ceil(34 + level ** (5 / 2))

let messageChannel: TextChannel;

export async function giveXp(member: GuildMember, xpToAdd: number) {
    console.log(`Giving ${xpToAdd} XP to ${member.displayName} (${member.user.username}#${member.user.discriminator})`)
    const user = await User.findOne({where: {id: member.id}})

    let xp = user?.get("xp") as number || 0
    let level = user?.get("level") as number || 0

    xp += xpToAdd
    while (xp >= xpForLevel(level)) {
        level++;
        xp -= xpForLevel(level);
    }

    while (xp < 0) {
        xp += xpForLevel(--level);
    }

    level = Math.max(level, 0);
    xp = Math.max(xp, 0)

    if (level !== 0 && level !== user?.get("level") as number) {
        await messageChannel.send({
            ...setupEmbed(member),
            embeds: [{
                title: `Level Up!`,
                description: `<@${member.id}>, you are now level ${level}!`
            }]
        })
    }

    await User.upsert({
        id: member.id,
        xp: xp,
        level: level,
    })
}

export async function setupXp(client: Client) {
    messageChannel = await client.channels.fetch(config.botCommandsChannel) as TextChannel
    client.on("messageCreate", async msg => {
        if (shouldCountForXp(msg))
            await giveXp(msg.member!, Math.ceil(Math.random() * 3) + 2)
    })
}