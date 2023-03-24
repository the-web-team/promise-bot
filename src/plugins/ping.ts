import { SlashCommandBuilder } from 'discord.js'
import createPlugin from '../lib/createPlugin'

const pingPlugin = createPlugin({
	slashCommandHandlers: [
		{
			data: new SlashCommandBuilder()
				.setName('ping')
				.setDescription('Replies with pong!'),
			handler: async (interaction) => {
				await interaction.reply('Pong!')
			},
		},
	],
})

export default pingPlugin
