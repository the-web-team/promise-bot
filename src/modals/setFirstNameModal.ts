import { type GuildMember, inlineCode } from 'discord.js'
import { getGuildConfig } from '../config'

export default {
	name: 'setFirstNameModal',
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
			guildMember.roles.add(guildConfig.plugins.setName.role)
		])

		await interaction.reply(`Your name has been set to ${inlineCode(`.${sanitizedUsername}`)}!`)
	},
} as ModalCommand
