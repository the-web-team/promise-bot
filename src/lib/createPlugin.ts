import type {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Client,
	Message,
	ModalSubmitInteraction,
	GatewayIntentBits,
	SlashCommandBuilder,
	GuildMember,
} from 'discord.js'

const createPlugin = (plugin: Plugin) => {
	return {
		config: plugin,
		attach: (client: Client) => {
			if (plugin.onReady) {
				client.on('ready', plugin.onReady)
			}

			if (plugin.onGuildMemberAdd) {
				client.on('guildMemberAdd', plugin.onGuildMemberAdd)
			}

			if (plugin.onMessage) {
				client.on('messageCreate', plugin.onMessage)
			}

			if (
				plugin.slashCommandHandlers ||
				plugin.modalSubmitHandlers ||
				plugin.buttonHandlers
			) {
				client.on('interactionCreate', async (interaction) => {
					if (
						plugin.slashCommandHandlers &&
						interaction.isChatInputCommand()
					) {
						for await (const { data, handler } of plugin.slashCommandHandlers) {
							if (data.name === interaction.commandName) {
								await handler(interaction)
								break
							}
						}
					}

					if (
						plugin.modalSubmitHandlers &&
						interaction.isModalSubmit()
					) {
						const modalEntries = Object.entries(plugin.modalSubmitHandlers)

						for await (const [name, handler] of modalEntries) {
							if (name === interaction.customId) {
								await handler(interaction)
								break
							}
						}
					}

					if (
						plugin.buttonHandlers &&
						interaction.isButton()
					) {
						const buttonEntries = Object.entries(plugin.buttonHandlers)

						for await (const [name, handler] of buttonEntries) {
							if (name === interaction.customId) {
								await handler(interaction)
								break
							}
						}
					}
				})
			}
		},
	}
}

export type Plugin = {
	intents?: GatewayIntentBits[]
	onReady?: (client: Client) => Promise<void>
	onMessage?: (message: Message) => Promise<void>
	onGuildMemberAdd?: (member: GuildMember) => Promise<void>
	modalSubmitHandlers?: Record<string, (interaction: ModalSubmitInteraction) => Promise<void>>
	slashCommandHandlers?: {
		data: SlashCommandBuilder
		handler: (interaction: ChatInputCommandInteraction) => Promise<void>
	}[]
	buttonHandlers?: Record<string, (interaction: ButtonInteraction) => Promise<void>>
}

export default createPlugin
