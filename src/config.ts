import {HexColorString, Snowflake} from "discord.js";

export type Config = {
	developerRole: Snowflake,
	announcementChannel: Snowflake,
	pluginListChannel: Snowflake,
	guildId: Snowflake,
	clientId: Snowflake,
	developers: {[key: Snowflake]: { category: Snowflake, color: HexColorString }}
}

export const config : Config = {
	clientId: "815180325817679878",
	guildId: "933415275515224125",
	developerRole: "933415571691827212",
	pluginListChannel: "933454014878728222",
	announcementChannel: "933640357428748319",
	developers: {
		"199036109760495616": { // lucy
			category: "933446759496163328",
			color: "#ffaaff"
		}
	}
}