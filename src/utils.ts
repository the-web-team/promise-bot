import {
	userMention,
	channelMention,
} from 'discord.js'

export const parseWelcomeMessage = (memberId: string, message: string) => {
	const channelRegex = /\{channel:(.*)}/g
	const memberRegex = /\{member:(.*)}/g
	return message
		.replaceAll('{member}', userMention(memberId))
		.replaceAll(channelRegex, (substring, channelId) => {
			return channelMention(channelId)
		})
		.replaceAll(memberRegex, (substring, memberId) => {
			return userMention(memberId)
		}).trim()
}
