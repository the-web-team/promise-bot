import type { TextChannel , GuildMember } from 'discord.js'
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	inlineCode,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import createPlugin from '../lib/createPlugin'
import { getGuildConfig } from '../config'
import { parseMessageVars } from '../utils'

const welcomeMessagePlugin = createPlugin({
	onGuildMemberAdd: async (member) => {
		const config = await getGuildConfig(member.guild.id)
		if (config.plugins.welcomeMessage) {
			const channel = await member.client.channels.fetch(config.plugins.welcomeMessage.channel) as TextChannel

			if (!channel) {
				console.error(`Guild: ${member.guild.id} - Failed to send WELCOME MESSAGE`)
				return
			}

			if (!channel.isTextBased) {
				console.error(`Guild: ${member.guild.id} - Channel ${channel.id} is not text based`)
				return
			}

			const welcomeMessage = parseMessageVars(config.plugins.welcomeMessage.message, {
				memberId: member.id,
			})

			if (config.plugins.welcomeMessage.withSetNameButton) {
				const firstNameButton = new ButtonBuilder()
					.setCustomId('setFirstNameButton')
					.setLabel('Set my first name!')
					.setStyle(ButtonStyle.Primary)

				const row = new ActionRowBuilder<ButtonBuilder>()
					.addComponents(firstNameButton)

				await channel.send({
					content: welcomeMessage,
					components: [row],
				})
			} else {
				await channel.send(welcomeMessage)
			}
		}
	},
	modalSubmitHandlers: {
		setFirstNameModal: async (interaction) => {
			if (!interaction.guildId) {
				await interaction.reply({
					content: 'You must do this action while in a guild...',
					ephemeral: true,
				})
				return
			}

			const guildConfig = await getGuildConfig(interaction.guildId as string)

			if (!guildConfig.plugins.setName) {
				await interaction.reply({
					content: 'Not sure how you got here! Your guild does not have the `setName` plugin enabled...',
					ephemeral: true,
				})
				return
			}

			const firstName = interaction.fields.getTextInputValue('firstName')
			const sanitizedUsername = firstName
				.replace(/[^a-zA-Z]/g, '')
				.toLowerCase()
			const guildMember = interaction.member as GuildMember

			const role = guildConfig.plugins.setName.role
			if (!role) {
				await interaction.reply({
					content: 'Invalid Role, please notify an admin!',
					ephemeral: true,
				})
				return
			}

			if (guildMember.roles.cache.has(role)) {
				await interaction.reply({
					content: 'You are already registered!',
					ephemeral: true,
				})
				return
			}

			await Promise.all([
				guildMember.setNickname(`.${sanitizedUsername}`),
				guildMember.roles.add(guildConfig.plugins.setName.role),
			])

			await interaction.reply(`Your name has been set to ${inlineCode(`.${sanitizedUsername}`)}!`)
		},
	},
	buttonHandlers: {
		setFirstNameButton: async (interaction) => {
			if (!interaction.guildId) {
				await interaction.reply({
					content: 'You must do this action while in a guild...',
					ephemeral: true,
				})
				return
			}

			const guildConfig = await getGuildConfig(interaction.guildId as string)

			if (!guildConfig.plugins.setName) {
				await interaction.reply({
					content: 'Not sure how you got here! Your guild does not have the `setName` plugin enabled...',
					ephemeral: true,
				})
				return
			}

			const guildMember = interaction.member as GuildMember
			const role = guildConfig.plugins.setName.role
			if (!role) {
				await interaction.reply({
					content: 'Invalid Role, please notify an admin!',
					ephemeral: true,
				})
				return
			}

			if (guildMember.roles.cache.has(role)) {
				await interaction.reply({
					content: 'You are already registered!',
					ephemeral: true,
				})
				return
			}

			const modal = new ModalBuilder()
				.setCustomId('setFirstNameModal')
				.setTitle('Set First Name')

			const firstNameInput = new TextInputBuilder()
				.setCustomId('firstName')
				.setLabel('What is your First Name?')
				.setStyle(TextInputStyle.Short)

			const firstActionRow = new ActionRowBuilder<TextInputBuilder>()
				.addComponents(firstNameInput)

			modal.addComponents(firstActionRow)

			await interaction.showModal(modal)
		},
	},
})

export default welcomeMessagePlugin
