import type { TextChannel } from 'discord.js'
import {
	GatewayIntentBits,
	inlineCode,
	SlashCommandBuilder,
	userMention,
} from 'discord.js'
import createPlugin from '../lib/createPlugin'
import prisma from '../prisma'
import { getGuildConfig } from '../config'

type KarmaOperations = Record<string, {
	kudos: number
	kudonts: number
}>

const getIdsByRegex = (content: string, regex: RegExp) => {
	const matches = content.match(regex) || []
	return new Set<string>(matches.map((match) => {
		return extractIdFromKudoMention(match)
	}))
}

const extractIdFromKudoMention = (kudoMention: string) => {
	return kudoMention.match(/\d+/)?.at(0) as string
}

const createCommaSeparatedMentions = (userIds: Set<string>) => {
	const mentions = [...userIds].map((userId) => {
		return userMention(userId)
	})

	if (mentions.length === 0) {
		return ''
	} else if (mentions.length === 1) {
		return mentions[0]
	} else if (mentions.length === 2) {
		return mentions.join(' and ')
	} else if (mentions.length > 3) {
		const lastMention = mentions.pop()
		const str = mentions.join(', ')
		return str.concat(`, and ${lastMention}`)
	}

	throw new Error(`Kudos Error: Invalid mentions length - "${mentions.length}"`)
}

const updateUsersKudos = async (guildId: string, operations: KarmaOperations) => {
	await prisma.kudo.createMany({
		data: Object.entries(operations).map(([userId, operation]) => {
			return {
				userId,
				guildId,
				kudos: operation.kudos,
				kudonts: operation.kudonts,
			}
		}),
	})
}

const kudosPlugin = createPlugin({
	name: 'Kudos',
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
	onMessage: async (message) => {
		if (message.channel.isTextBased() && message.guildId) {
			const hasUserKudos = message.content.match(/<@!?(\d+)> (\+\+)/g)
			const hasUserKudonts = message.content.match(/<@!?(\d+)> (--)/g)
			const hasRoleKudos = message.content.match(/<@&(\d+)> (\+\+)/g)
			const hasRoleKudonts = message.content.match(/<@&(\d+)> (--)/g)
			if (hasUserKudos || hasUserKudonts || hasRoleKudos || hasRoleKudonts) {

				const config = await getGuildConfig(message.guildId)
				if (config.plugins.kudos) {
					const textChannel = message.channel as TextChannel
					await textChannel.sendTyping()

					const operations: KarmaOperations = {}
					const initializeKarmaOperation = (userId: string) => {
						if (!operations[userId]) {
							operations[userId] = {
								kudos: 0,
								kudonts: 0,
							}
						}
					}

					const addKudo = (userId: string) => {
						initializeKarmaOperation(userId)
						operations[userId].kudos++
					}

					const addKudont = (userId: string) => {
						initializeKarmaOperation(userId)
						operations[userId].kudonts++
					}

					const oneKudoUsers = getIdsByRegex(message.content, /<@!?(\d+)> (\+\+)/g)
					const oneKudontUsers = getIdsByRegex(message.content, /<@!?(\d+)> (--)/g)

					if (oneKudoUsers.has(message.author.id) || oneKudontUsers.has(message.author.id)) {
						const authorMention = userMention(message.author.id)
						await message.reply({
							content: `${authorMention}... don't cheat! You can't give yourself kudos or kudonts!!`,
						})
					} else {
						const guild = await message.client.guilds.fetch(message.guildId)

						const oneKudoRoles = getIdsByRegex(message.content, /<@&(\d+)> (\+\+)/g)
						const oneKudontRoles = getIdsByRegex(message.content, /<@&(\d+)> (--)/g)

						if (oneKudoRoles.size > 0 || oneKudontRoles.size > 0) {
							await guild.members.fetch()
						}

						const roles = await Promise.all([...oneKudoRoles, ...oneKudontRoles].map(async (roleId) => {
							return guild.roles.fetch(roleId)
						}))
						const rolesToMemberIds = roles.reduce((rolesToMembers, role) => {
							if (role) {
								rolesToMembers.set(role.id, role.members.map((member) => {
									return member.id
								}))
							}
							return rolesToMembers
						}, new Map<string, string[]>())

						// Aggregate members of the roles receiving kudos and kudonts
						const asyncFunctions: (() => Promise<void> | void)[] = []
						oneKudoRoles.forEach((kudoRole) => {
							asyncFunctions.push(() => {
								const roleMemberIds = rolesToMemberIds.get(kudoRole) as string[]
								for (const roleMemberId of roleMemberIds) {
									oneKudoUsers.add(roleMemberId)
								}
							})
						})
						oneKudontRoles.forEach((kudontRole) => {
							asyncFunctions.push(() => {
								const roleMemberIds = rolesToMemberIds.get(kudontRole) as string[]
								for (const roleMemberId of roleMemberIds) {
									oneKudontUsers.add(roleMemberId)
								}
							})
						})
						await Promise.all(asyncFunctions.map(async (asyncFn) => {
							await asyncFn()
						}))

						if (oneKudoUsers.size > 0 || oneKudontUsers.size > 0) {
							// Be sure we don't give the author kudos or kudonts
							oneKudoUsers.delete(message.author.id)
							oneKudontUsers.delete(message.author.id)

							oneKudoUsers.forEach((oneKudoUser) => {
								addKudo(oneKudoUser)
							})
							oneKudontUsers.forEach((oneKudontUser) => {
								addKudont(oneKudontUser)
							})

							await updateUsersKudos(message.guildId, operations)

							// Generate message reply
							let messageReplyContent = `${userMention(message.author.id)} gave `

							const kudoList = createCommaSeparatedMentions(oneKudoUsers)
							const kudontList = createCommaSeparatedMentions(oneKudontUsers)

							if (kudoList.length > 0) {
								messageReplyContent = messageReplyContent.concat(`${kudoList} a kudo${oneKudoUsers.size > 1 ? ' each' : ''}`)
							}

							if (kudontList.length > 0) {
								messageReplyContent = messageReplyContent.concat(kudoList.length > 0 ? ' as well as gave ' : '', `${kudontList} a kudont${oneKudontUsers.size > 1 ? ' each' : ''}`)
							}

							messageReplyContent = messageReplyContent.concat('.')

							await textChannel.send({
								content: messageReplyContent,
							})
						}
					}
				}
			}
		}
	},
	slashCommandHandlers: [
		{
			data: new SlashCommandBuilder()
				.addSubcommand((subcommand) => {
					return subcommand
						.setName('get')
						.setDescription('Get a user\'s kudos')
						.addUserOption((option) => {
							return option.setName('guild_member')
								.setDescription('Member to lookup')
								.setRequired(true)
						})
				})
				.setName('kudo')
				.setDescription('Interact with the Kudos plugin'),
			handler: async (interaction) => {
				if (interaction.options.getSubcommand() === 'get') {
					const user = interaction.options.getUser('guild_member')
					if (user) {
						const aggregations = await prisma.kudo.aggregate({
							_sum: {
								kudos: true,
								kudonts: true,
							},
							where: {
								guildId: interaction.guildId as string,
								userId: user.id,
							},
						})
						const totalKudos = aggregations._sum.kudos?.toString() || '0'
						const totalKudonts = aggregations._sum.kudonts?.toString() || '0'
						await interaction.reply({
							content: `${userMention(user.id)} has ${inlineCode(totalKudos)} kudos and ${inlineCode(totalKudonts)} kudonts.`,
						})
					} else {
						await interaction.reply({
							content: 'GetKudoError: Something went wrong...',
							ephemeral: true,
						})
					}
				}
			},
		},
	],
})

export default kudosPlugin
