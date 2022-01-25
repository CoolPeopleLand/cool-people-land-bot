import {GuildMember } from "discord.js";
import {config} from "../config.js";

export function setupEmbed(user?: GuildMember | null) {
    return user && !user.roles.cache.has(config.noPingRole) ? {
        content: `<@${user.id}> (don't want to be mentioned? \`/role @No Ping\`)`
    } : {}
}