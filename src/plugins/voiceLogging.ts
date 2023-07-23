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
			if (oldState.channelId !== newState.channelId) {
				// User leaves a channel
				if (oldState.channelId && oldState.member && oldState.channel && oldState.channel.isVoiceBased()) {
					const goodJoke = await goodJokeFromName(oldState.member.displayName)
					const memberMention = userMention(oldState.member.id)

					await oldState.channel.send({
						content: `${memberMention} left the channel...\n\n${goodJoke}`,
					})
				}

				// User joins a channel
				if (newState.channelId && newState.channel && newState.channel.isVoiceBased() && newState.member) {
					const goodJoke = await goodJokeFromName(newState.member.displayName)
					const memberMention = userMention(newState.member.id)

					await newState.channel.send({
						content: `${memberMention} joined the channel!\n\n${goodJoke}`,
					})
				}
			}
		}
	},
})

export default voiceLoggerPlugin
