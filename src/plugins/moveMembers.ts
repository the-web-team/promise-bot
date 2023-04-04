import { channelMention, bold, ChannelType, GatewayIntentBits, SlashCommandBuilder, userMention } from 'discord.js'
import createPlugin from '../lib/createPlugin'
import { rephrase } from '../lib/openai'

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

				const membersArray = Array.from(from.members)
				const numMembers = membersArray.length

				const rephrased = await rephrase('There are no members to move in the')

				if (numMembers === 0) {
					await interaction.reply({
						content: `${bold('Error:')} ${rephrased} ${channelMention(from.id)} channel...`,
						options: {
							ephemeral: true,
						},
					})
				}

				const memberList = membersArray.reduce((list, [id], index) => {
					const mention = userMention(id)

					if (list.length === 0 && numMembers === 1 || index === 0) {
						return mention
					} else if (list.length === index + 1) {
						return `${list} and ${mention}`
					}

					return `${list}, ${mention}`
				}, '')
				await Promise.all(from.members.map(async (member) => {
					return member.voice.setChannel(to.id, `Moved by ${interaction.member?.user.username}#${interaction.member?.user.discriminator}.`)
				}))

				const toChannelMention = channelMention(to.id)

				await interaction.reply({
					content: `${memberList} ${numMembers > 1 ? 'has' : 'have'} been moved to the ${toChannelMention} channel.`,
					options: {
						ephemeral: true,
					},
				})
			},
		},
	],
})

export default moveMembersPlugin
