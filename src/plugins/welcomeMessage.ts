import {
	type GuildMember,
	type TextChannel,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} from 'discord.js'
import { parseMessageVars } from '../utils'
import { getGuildConfig } from '../config'

const welcomeMessage = async (member: GuildMember) => {
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
}

export default welcomeMessage
