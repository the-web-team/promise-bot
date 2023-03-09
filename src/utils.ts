import {
	userMention,
	channelMention,
} from 'discord.js'

const parseChannelVar = (message: string, currentChannelId?: string) => {
	const channelMentionRegex = /\{channel:(.*)}/g
	const currentChannelRegex = /^\{channel}$/g

	return message
		.replace(currentChannelRegex, (substring) => {
			if (!currentChannelId) {
				return substring
			}
			return channelMention(currentChannelId)
		})
		.replace(channelMentionRegex, (substring, channelId) => {
			return channelMention(channelId)
		})
}

const parseMemberVar = (message: string, currentMemberId?: string) => {
	const memberMentionRegex = /\{member:(.*)}/g
	const currentMemberRegex = /\{member}/g

	return message
		.replace(currentMemberRegex, (substring) => {
			if (!currentMemberId) {
				return substring
			}
			return userMention(currentMemberId)
		})
		.replace(memberMentionRegex, (substring, channelId) => {
			return userMention(channelId)
		})
}

export const parseMessageVars = (message: string, currentVars?: {
	channelId?: string
	memberId?: string
}) => {
	return parseMemberVar(
		parseChannelVar(message, currentVars?.channelId),
		currentVars?.memberId,
	)
}
