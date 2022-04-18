import {ApplicationCommandType} from 'discord-api-types/v10'
import {config} from '../../config.js'
import {projectAdd} from './projectAdd.js'
import {projectUpdateEmbeds} from './projectUpdateEmbeds.js'
import {projectUpdate} from './projectUpdate.js'
import {projectDelete} from './projectDelete.js'
import {Command} from 'djs-slash-helper'

export const projectRoot: Command<ApplicationCommandType.ChatInput> = {
	type: ApplicationCommandType.ChatInput,
	name: "project",
	description: "Project management for developers",
	permissions: [{
		type: "ROLE",
		id: config.developerRole,
		permission: true
	}],
	default_permission: false,
	options: [projectAdd, projectUpdateEmbeds, projectUpdate, projectDelete],
	handle() {
	}
};
