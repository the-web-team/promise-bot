import { userMention, GatewayIntentBits } from 'discord.js'
import { getGuildConfig } from '../config'
import createPlugin from '../lib/createPlugin'

const voiceLoggerPlugin = createPlugin({
	name: 'Voice Logging',
	intents: [
		GatewayIntentBits.GuildVoiceStates,
	],
	onVoiceStateUpdate: async (oldState, newState) => {
		const config = await getGuildConfig(oldState.guild.id)

		if (config.plugins?.voiceLogging?.enabled) {
			// User leaves a channel
			if (oldState.channelId === newState.channelId) {
				if (oldState.channelId && oldState.member && oldState.channel) {
					await oldState.channel.send({
						content: `${userMention(oldState.member.id)} left the channel.`,
					})
				}

				if (newState.channelId && newState.channel && newState.member) {
					await newState.channel.send({
						content: `${userMention(newState.member.id)} joined the channel.`,
					})
				}
			}
		}
	},
})

export default voiceLoggerPlugin
