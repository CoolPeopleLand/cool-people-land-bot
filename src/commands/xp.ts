import {Command} from "./command.js";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, GuildMember} from "discord.js";
import {User} from "../storage.js";
import {xpForLevel} from "../util/xp.js";

export const xpCommand: Command = {
    info: new SlashCommandBuilder()
        .setName("xp")
        .setDescription("Shows your current XP")
        .addUserOption(x => x.setName("user").setDescription("The user to show XP")),

    async execute(interaction: CommandInteraction) {

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