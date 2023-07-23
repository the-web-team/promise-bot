import type { TextChannel } from 'discord.js'
import createPlugin from '../lib/createPlugin'
import { getGuildConfig } from '../config'

const promoteActiveChannelsPlugin = createPlugin({
	name: 'Promote Active Channels',
	onMessage: async (message) => {
		if (message.guildId) {
			const config = await getGuildConfig(message.guildId)
			if (config.plugins.promoteActiveChannels) {
				const { enabledCategories } = config.plugins.promoteActiveChannels

				const channel = await message.client.channels.fetch(message.channelId) as TextChannel

				if (!channel) {
					console.error(`Guild: ${message.guildId} - [Promote Active Channels] - Failed to find Channel`)
					return
				}

				if (!channel.isTextBased) {
					return
				}

				if (!channel.parentId || !enabledCategories.includes(channel.parentId)) {
					return
				}

				await channel.setPosition(0, {
					reason: 'Bot: Promote Active Channel',
				})
			}
		}
	},
})

export default promoteActiveChannelsPlugin
