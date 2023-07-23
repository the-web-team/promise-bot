import { userMention, GatewayIntentBits } from 'discord.js'
import { getGuildConfig } from '../config'
import createPlugin from '../lib/createPlugin'
import { goodJokeFromName } from '../lib/openai'

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
					const goodJoke = await goodJokeFromName(oldState.member.displayName)

					await oldState.channel.send({
						content: `${userMention(oldState.member.id)} left the channel... ${goodJoke}`,
					})
				}

				if (newState.channelId && newState.channel && newState.member) {
					const goodJoke = await goodJokeFromName(newState.member.displayName)

					await newState.channel.send({
						content: `${userMention(newState.member.id)} joined the channel! ${goodJoke}`,
					})
				}
			}
		}
	},
})

export default voiceLoggerPlugin
