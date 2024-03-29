import { channelMention, bold, ChannelType, GatewayIntentBits, SlashCommandBuilder, userMention } from 'discord.js'
import createPlugin from '../lib/createPlugin'
import { rephrase } from '../lib/openai'

const moveMembersPlugin = createPlugin({
	name: 'Move Members',
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
				const memberId = interaction.member?.user.id

				await interaction.reply({
					content: await rephrase('Moving members as requested.'),
					ephemeral: true,
				})

				const from = await interaction.options.getChannel('from', true, [ChannelType.GuildVoice]).fetch(true)
				const to = await interaction.options.getChannel('to', true, [ChannelType.GuildVoice]).fetch(true)

				const membersArray = Array.from(from.members)
				membersArray.sort((a, b) => {
					const aOrder = a[0] === memberId ? 0 : 1
					const bOrder = b[0] === memberId ? 0 : 1

					return bOrder - aOrder
				})
				const numMembers = membersArray.length

				const rawRephrased = await rephrase(`There are no members in the ${from.id} channel to move...`)
				const fromChannelMention = channelMention(from.id)
				const rephrased = rawRephrased?.replace(from.id, fromChannelMention)

				if (numMembers === 0) {
					await interaction.reply({
						content: `${bold('Error:')} ${rephrased}`,
						ephemeral: true,
					})
				} else {

					const membersList = membersArray.reduce((list, [id], index) => {
						if (list.length === 0 && numMembers === 1 || index === 0) {
							return id
						} else if (list.length === index + 1) {
							return `${list} and ${id}`
						}

						return `${list}, ${id}`
					}, '')

					await Promise.all(from.members.map(async (member) => {
						return member.voice.setChannel(to.id, `Moved by ${interaction.member?.user.username}#${interaction.member?.user.discriminator}.`)
					}))

					const toChannelMention = channelMention(to.id)
					const verb = numMembers > 1 ? 'have' : 'has'
					const rawReply = `${membersList} ${verb} been moved to the ${to.id} channel.`
					const rephrasedReply = await rephrase(rawReply)
					const rephrasedReplyFixedChannel = rephrasedReply
						.replace(to.id, toChannelMention)
					const reply = membersArray
						.reduce((reply, [id]) => {
							const mention = id === interaction.member?.user.id ? 'you' : userMention(id)
							return reply.replace(id, mention)
						}, rephrasedReplyFixedChannel)

					await interaction.followUp({
						content: reply,
						ephemeral: true,
					})
				}
			},
		},
	],
})

export default moveMembersPlugin
