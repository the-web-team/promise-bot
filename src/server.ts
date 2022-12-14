import { Client, GatewayIntentBits } from 'discord.js'
import { registerInteractions } from './interactions'
import welcomeMessage from './plugins/welcomeMessage'
import promoteActiveChannels from './plugins/promoteActiveChannels'
import config from './config'
import kudosPlugin from './plugins/kudos'

registerInteractions().then(async ({ commands, buttons, modals }) => {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.MessageContent,
			GatewayIntentBits.GuildMembers,
		],
	})

	client.on('ready', () => {
		console.log(`Logged in as ${client.user?.tag}`)
	})

	client.on('guildMemberAdd', async (member) => {
		await welcomeMessage(member)
	})

	client.on('messageCreate', async (message) => {
		if (message.author.id !== client.user?.id) {
			await Promise.allSettled([
				// Add messageCreatePlugins here
				promoteActiveChannels(message),
				kudosPlugin(message),
			])
		}
	})

	client.on('interactionCreate', async (interaction) => {
		if (interaction.isChatInputCommand()) {
			const command = commands.find((command) => {
				return command.data.name === interaction.commandName
			})
			await command?.handler(interaction)
		} else if (interaction.isModalSubmit()) {
			const modal = modals.find((modal) => {
				return modal.name === interaction.customId
			})
			await modal?.handler(interaction)
		} else if (interaction.isButton()) {
			const button = buttons.find((button) => {
				return button.name === interaction.customId
			})
			await button?.handler(interaction)
		}
	})

	await client.login(config.discord.token)
})
