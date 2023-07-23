import fs from 'node:fs/promises'
import path from 'node:path'
import type {
	GatewayIntentBits,
	SlashCommandBuilder,
} from 'discord.js'
import type createPlugin from './lib/createPlugin'
import { Client, Routes } from 'discord.js'
import { REST } from '@discordjs/rest'
import config from './config'

type PluginConfig = ReturnType<typeof createPlugin>

const getPlugins = async (): Promise<ReturnType<typeof createPlugin>[]> => {
	const files = await fs.readdir(path.join(__dirname, 'plugins'))
	const pluginFiles = files.filter((file) => {
		return file.endsWith('.ts')
	})

	return Promise.all(pluginFiles.map(async (pluginFile) => {
		console.log(`Plugin (${pluginFile}) loading...`)

		const plugin = await import(path.join(__dirname, 'plugins', pluginFile))

		console.log(`Plugin (${pluginFile}) loaded.`)

		return plugin.default
	}))
}

const collectIntents = (plugins: PluginConfig[]) => {
	const intents = new Set<GatewayIntentBits>()

	for (const plugin of plugins) {
		if (plugin.config.intents) {
			for (const intent of plugin.config.intents) {
				intents.add(intent)
			}
		}
	}

	return Array.from(intents)
}

const attachPlugins = (client: Client, plugins: PluginConfig[]) => {
	client.on('error', (err) => {
		console.error(err)
	})

	for (const plugin of plugins) {
		plugin.attach(client)
	}
}

const registerSlashCommands = async (plugins: PluginConfig[]) => {
	const slashCommands: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>[] = []

	plugins.forEach((plugin) => {
		const commands = plugin.config.slashCommandHandlers ?? []
		commands?.forEach((command) => {
			slashCommands.push(command.data)
		})
	})

	if (slashCommands.length > 0) {
		const rest = new REST({
			version: '10',
		}).setToken(config.discord.token)

		try {
			console.log(`Started refreshing ${slashCommands.length} application (/) commands.`)

			const data = await rest.put(Routes.applicationCommands(config.discord.clientId), {
				body: slashCommands.map((command) => {
					return command.toJSON()
				}),
			}) as unknown[]

			console.log(`Successfully reloaded ${data.length} application (/) commands.`)
		} catch (err) {
			console.error(err)
		}
	}
}

const start = async () => {
	const plugins = await getPlugins()
	await registerSlashCommands(plugins)

	const intents = collectIntents(plugins)
	const client = new Client({ intents })
	attachPlugins(client, plugins)

	client.on('ready', () => {
		console.log(`Logged in as ${client.user?.tag}`)
	})

	await client.login(config.discord.token)
}

export default start
