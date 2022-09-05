import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	ModalSubmitInteraction,
	SlashCommandBuilder,
} from 'discord.js'

declare global {
	type GuildConfig = {
		plugins: {
			welcomeMessage?: {
				channel: string
				message: string
				withSetNameButton?: boolean
			}
			setName?: {
				role: string
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
