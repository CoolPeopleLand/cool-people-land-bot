import {HexColorString, Snowflake} from "discord.js";

export type Config = {
	developerRole: Snowflake,
	noPingRole: Snowflake,
	announcementChannel: Snowflake,
	pluginListChannel: Snowflake,
	botCommandsChannel: Snowflake,
	guildId: Snowflake,
	clientId: Snowflake,
	developers: {[key: Snowflake]: { category: Snowflake, color: HexColorString }}
}

export const config : Config = {
	clientId: "815180325817679878",
	guildId: "933415275515224125",
	developerRole: "933415571691827212",
	noPingRole: "935633135503278101",
	pluginListChannel: "933454014878728222",
	announcementChannel: "933640357428748319",
	botCommandsChannel: "933437640060076163",
	developers: {
		"199036109760495616": { // lucy
			category: "933446759496163328",
			color: "#ffaaff"
		},
		"469980680944877568": { // emily
			category: "933446865133899826",
			color: "#914FF2"
		}
	}
}