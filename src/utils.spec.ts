import { describe, test, expect } from '@jest/globals'
import { parseMessageVars } from './utils'

describe('utils', () => {
	describe('parseMessageVars', () => {
		test('should parse message properly', () => {
			const message = parseMessageVars('Welcome {member}!\n@everyone feel free to introduce yourselves to each other.\n\n{member} optionally you may add an {channel:589662168430149642} if you\'d like.\nSome others have made their own as welland you can copy their format if you\'d like.\nYou\'re able to update it whenever! This is the {channel} channel.', {
				memberId: '1234',
				channelId: '5678',
			})
			expect(message)
				.toEqual('Welcome <@1234>!\n@everyone feel free to introduce yourselves to each other.\n\n<@1234> optionally you may add an <#589662168430149642> if you\'d like.\nSome others have made their own as welland you can copy their format if you\'d like.\nYou\'re able to update it whenever! This is the <#5678> channel.')
		})
	})
})
