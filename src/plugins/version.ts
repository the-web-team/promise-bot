import { SlashCommandBuilder, hyperlink, inlineCode, bold } from 'discord.js'
import createPlugin from '../lib/createPlugin'
import config from '../config'

const versionPlugin = createPlugin({
	slashCommandHandlers: [
		{
			data: new SlashCommandBuilder()
				.setName('version')
				.setDescription('Checks the bot version sha.'),
			handler: async (interaction) => {
				await interaction.reply({
					content: `${bold('Version:')} ${hyperlink(inlineCode(config.version), `https://github.com/the-web-team/promise-bot/commit/${config.version}`)}`,
					ephemeral: true,
				})
			},
		},
	],
})

export default versionPlugin
