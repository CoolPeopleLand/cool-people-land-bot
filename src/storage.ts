import {DataTypes, Model, Sequelize} from "sequelize";

const sequelize = new Sequelize("sqlite:db.sqlite");

export class Plugin extends Model {
}

Plugin.init({
	name: DataTypes.STRING,
	description: DataTypes.STRING,
	currentVersion: DataTypes.STRING,
	downloadUrl: DataTypes.STRING,
	developerUserId: DataTypes.STRING,
	announcementRole: DataTypes.STRING,
	helpChannel: DataTypes.STRING
}, {sequelize, modelName: "Plugin"})

export async function initStorage() {
	await sequelize.sync({alter: true})
}
