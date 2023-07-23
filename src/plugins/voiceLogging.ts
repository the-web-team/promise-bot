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
			console.log('oldState.channelId', oldState.channelId)
			console.log('newState.channelId', newState.channelId)
			console.log('oldState.member.displayName', oldState.member?.displayName)
			console.log('oldState.member.id', oldState.member?.id)
			console.log('oldState.channel.id', oldState.channel?.id)
			console.log('newState.member.displayName', newState.member?.displayName)
			console.log('newState.member.id', newState.member?.id)
			console.log('newState.channel.id', newState.channel?.id)

			// User leaves a channel
			if (oldState.channelId !== newState.channelId) {
				console.log('changed')

				if (oldState.channelId && oldState.member && oldState.channel && oldState.channel.isVoiceBased()) {
					console.log('left')

					const goodJoke = await goodJokeFromName(oldState.member.displayName)
					const memberMention = userMention(oldState.member.id)

					await oldState.channel.send({
						content: `${memberMention} left the channel...\n${goodJoke}`,
					})
				}

				if (newState.channelId && newState.channel && newState.channel.isVoiceBased() && newState.member) {
					console.log('joined')

					const goodJoke = await goodJokeFromName(newState.member.displayName)
					const memberMention = userMention(newState.member.id)

					await newState.channel.send({
						content: `${memberMention} joined the channel!\n${goodJoke}`,
					})
				}
			}
		}
	},
})

export default voiceLoggerPlugin
