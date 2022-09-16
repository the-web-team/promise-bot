import fs from 'node:fs/promises'
import path from 'node:path'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord.js'
import config from './config'

export const registerInteractions = async () => {
	const [commands, buttons, modals] = await Promise.all([
		getInteractions<SlashCommand>('commands'),
		getInteractions<ButtonCommand>('buttons'),
		getInteractions<ModalCommand>('modals'),
	])

	if (commands.length > 0) {
		const rest = new REST({ version: '10' }).setToken(config.discord.token)

		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`)

			const data = await rest.put(Routes.applicationCommands(config.discord.clientId), {
				body: commands.map((command) => {
					return command.data.toJSON()
				}),
			})

			console.log(`Successfully reloaded ${(data as unknown[]).length} application (/) commands.`)
		} catch (err) {
			console.error(err)
		}
	}

	return { commands, buttons, modals }
}

const getInteractions = async <T>(type: 'commands' | 'modals' | 'buttons'): Promise<T[]> => {
	const files = await fs.readdir(path.join(__dirname, type))
	const commandFiles = files.filter((file) => {
		return file.endsWith('.ts')
	})

	return Promise.all(commandFiles.map(async (file) => {
		return (await import(path.join(__dirname, type, file))).default
	}))
}
