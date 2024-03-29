import type {
	ButtonInteraction,
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js'

declare global {
	type GuildConfig = {
		plugins: {
			voiceLogging?: {
				enabled: boolean
			}
			welcomeMessage?: {
				channel: string
				message: string
				withSetNameButton?: boolean
			}
			setName?: {
				role: string
			}
			promoteActiveChannels?: {
				enabledCategories: string[]
			}
			kudos?: {
				maxKudo: number
				maxKudont: number
				cooldownSeconds: number
			}
		}
	}

	type SlashCommand = {
		data: SlashCommandBuilder
		handler: (interaction: ChatInputCommandInteraction) => Promise<void>
	}

	type ModalCommand = {
		name: string
		handler: (interaction: ModalSubmitInteraction) => Promise<void>
	}

	type ButtonCommand = {
		name: string
		handler: (interaction: ButtonInteraction) => Promise<void>
	}
}

export default null
