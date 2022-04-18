import {CommandInteraction, GuildMember} from "discord.js";
import {User} from "../storage.js";
import {xpForLevel} from "../util/xp.js";
import {ApplicationCommandOptionType, ApplicationCommandType} from 'discord-api-types/v10'
import {Command} from 'djs-slash-helper'

export const xpCommand: Command<ApplicationCommandType.ChatInput> = {
    type: ApplicationCommandType.ChatInput,
    name: "xp",
    description: "Shows your current XP",
    options: [{
        name: "user",
        description: "The user to show XP",
        type: ApplicationCommandOptionType.User,
        required: false
    }],
    permissions: [],

    async handle(interaction: CommandInteraction) {

        const target = (interaction.options.get("user")?.member || interaction.member) as GuildMember

        const user = await User.findOne({where: {id: target.id}})
        const xp = (user?.get("xp") || 0) as number
        const level = (user?.get("level") || 0) as number

        const xpToNext = xpForLevel(level)

        await interaction.reply({
            embeds: [{
                title: target.displayName,
                color: target.displayColor,
                description: `${target.roles.cache.filter(x => x.color != 0).map(x => `<@&${x.id}>`).join(" ")}
                Level **${level}**
                **${xp}** XP
                **${xpToNext - xp}** XP until level ${level + 1} (${(100 * xp / xpToNext).toFixed(1)}%)`,
                thumbnail: {url: target.displayAvatarURL() ?? "https://cdn.discordapp.com/embed/avatars/0.png"},
            }]
        })
    }
}