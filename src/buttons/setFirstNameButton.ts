import type { GuildMember } from 'discord.js'
import {
	ActionRowBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
} from 'discord.js'
import { getGuildConfig } from '../config'

export default {
	name: 'setFirstNameButton',
	handler: async (interaction) => {
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
} as ButtonCommand
