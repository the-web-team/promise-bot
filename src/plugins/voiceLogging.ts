import { userMention, GatewayIntentBits, EmbedBuilder } from 'discord.js'
import { getGuildConfig } from '../config'
import createPlugin from '../lib/createPlugin'
import { aionTip } from '../lib/openai'

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
					const tip = await aionTip()
					const memberMention = userMention(oldState.member.id)

					const embed = new EmbedBuilder()
						.setColor(0x4c0519)
						.setDescription(`**${memberMention} left the channel...**\n\n${tip}`)
						.setTimestamp()

					await oldState.channel.send({
						embeds: [embed],
					})
				}

				// User joins a channel
				if (newState.channelId && newState.channel && newState.channel.isVoiceBased() && newState.member) {
					const tip = await aionTip()
					const memberMention = userMention(newState.member.id)

					const embed = new EmbedBuilder()
						.setColor(0x022c22)
						.setDescription(`**${memberMention} joined the channel!**\n\n${tip}`)
						.setTimestamp()

					await newState.channel.send({
						embeds: [embed],
					})
				}
			}
		}
	},
})

export default voiceLoggerPlugin
