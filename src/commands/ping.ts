import { SlashCommandBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong!'),
	handler: async (interaction) => {
		await interaction.reply('Pong!')
	},
} as SlashCommand
