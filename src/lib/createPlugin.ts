import type {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Client,
	Message,
	ModalSubmitInteraction,
	GatewayIntentBits,
	SlashCommandBuilder,
	GuildMember,
	NonThreadGuildBasedChannel,
	DMChannel,
	GuildEmoji,
	GuildBan,
	PartialGuildMember,
	PartialMessage,
	Role,
	VoiceState,
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

			if (plugin.onMessageDelete) {
				client.on('messageDelete', plugin.onMessageDelete)
			}

			if (plugin.onMessageUpdate) {
				client.on('messageUpdate', plugin.onMessageUpdate)
			}

			if (plugin.onChannelCreate) {
				client.on('channelCreate', plugin.onChannelCreate)
			}

			if (plugin.onChannelDelete) {
				client.on('channelDelete', plugin.onChannelDelete)
			}

			if (plugin.onChannelUpdate) {
				client.on('channelUpdate', plugin.onChannelUpdate)
			}

			if (plugin.onEmojiCreate) {
				client.on('emojiCreate', plugin.onEmojiCreate)
			}

			if (plugin.onEmojiDelete) {
				client.on('emojiDelete', plugin.onEmojiDelete)
			}

			if (plugin.onEmojiUpdate) {
				client.on('emojiUpdate', plugin.onEmojiUpdate)
			}

			if (plugin.onGuildBanAdd) {
				client.on('guildBanAdd', plugin.onGuildBanAdd)
			}

			if (plugin.onGuildBanRemove) {
				client.on('guildBanRemove', plugin.onGuildBanRemove)
			}

			if (plugin.onGuildMemberRemove) {
				client.on('guildMemberRemove', plugin.onGuildMemberRemove)
			}

			if (plugin.onGuildMemberUpdate) {
				client.on('guildMemberUpdate', plugin.onGuildMemberUpdate)
			}

			if (plugin.onGuildMemberAdd) {
				client.on('guildMemberAdd', plugin.onGuildMemberAdd)
			}

			if (plugin.onRoleCreate) {
				client.on('roleCreate', plugin.onRoleCreate)
			}

			if (plugin.onRoleDelete) {
				client.on('roleDelete', plugin.onRoleDelete)
			}

			if (plugin.onRoleUpdate) {
				client.on('roleUpdate', plugin.onRoleUpdate)
			}

			if (plugin.onVoiceStateUpdate) {
				client.on('voiceStateUpdate', plugin.onVoiceStateUpdate)
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
	onMessageDelete?: (message: Message | PartialMessage) => Promise<void>
	onMessageUpdate?: (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => Promise<void>
	onChannelCreate?: (channel: NonThreadGuildBasedChannel) => Promise<void>
	onChannelDelete?: (channel: DMChannel | NonThreadGuildBasedChannel) => Promise<void>
	onChannelUpdate?: (oldChannel: DMChannel | NonThreadGuildBasedChannel, newChannel: DMChannel | NonThreadGuildBasedChannel) => Promise<void>
	onEmojiCreate?: (emoji: GuildEmoji) => Promise<void>
	onEmojiDelete?: (emoji: GuildEmoji) => Promise<void>
	onEmojiUpdate?: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => Promise<void>
	onGuildBanAdd?: (ban: GuildBan) => Promise<void>
	onGuildBanRemove?: (ban: GuildBan) => Promise<void>
	onGuildMemberRemove?: (member: GuildMember | PartialGuildMember) => Promise<void>
	onGuildMemberUpdate?: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => Promise<void>
	onGuildMemberAdd?: (member: GuildMember) => Promise<void>
	onRoleCreate?: (role: Role) => Promise<void>
	onRoleDelete?: (role: Role) => Promise<void>
	onRoleUpdate?: (oldRole: Role, newRole: Role) => Promise<void>
	onVoiceStateUpdate?: (oldState: VoiceState, newState: VoiceState) => Promise<void>
	modalSubmitHandlers?: Record<string, (interaction: ModalSubmitInteraction) => Promise<void>>
	slashCommandHandlers?: {
		data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
		handler: (interaction: ChatInputCommandInteraction) => Promise<void>
	}[]
	buttonHandlers?: Record<string, (interaction: ButtonInteraction) => Promise<void>>
}

export default createPlugin
