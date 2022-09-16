import { inlineCode, SlashCommandBuilder, userMention } from 'discord.js'
import prisma from '../prisma'

export default {
	data: new SlashCommandBuilder()
		.setName('kudo')
		.setDescription('Interact with the Kudos plugin')
		.addSubcommand((subcommand) => {
			return subcommand
				.setName('get')
				.setDescription('Get a user\'s kudos')
				.addUserOption((option) => {
					return option.setName('guild_member')
						.setDescription('Member to lookup')
						.setRequired(true)
				})
		}),
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
} as SlashCommand
