import type { VoiceChannel } from 'discord.js'
import { ChannelType, GatewayIntentBits, SlashCommandBuilder } from 'discord.js'
import createPlugin from '../lib/createPlugin'

const moveMembersPlugin = createPlugin({
	intents: [
		GatewayIntentBits.GuildVoiceStates,
	],
	slashCommandHandlers: [
		{
			data: new SlashCommandBuilder()
				.setName('move')
				.setDescription('Move all members in a voice channel to a new voice channel.')
				.addChannelOption((option) => {
					return option.setName('from')
						.setDescription('Channel of which to move members from.')
						.addChannelTypes(ChannelType.GuildVoice)
						.setRequired(true)
				})
				.addChannelOption((option) => {
					return option.setName('to')
						.setDescription('Channel of which to move members to.')
						.addChannelTypes(ChannelType.GuildVoice)
						.setRequired(true)
				}),
			handler: async (interaction) => {
				const from = await interaction.options.getChannel('from', true, [ChannelType.GuildVoice]).fetch(true)
				const to = await interaction.options.getChannel('to', true, [ChannelType.GuildVoice]).fetch(true)

				await Promise.all(from.members.map(async (member) => {
					return member.voice.setChannel(to.id, `Moved by ${interaction.member?.user.username}#${interaction.member?.user.discriminator}.`)
				}))
			},
		},
	],
})

export default moveMembersPlugin
