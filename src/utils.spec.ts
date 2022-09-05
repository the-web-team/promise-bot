import { describe, test } from '@jest/globals'
import { parseWelcomeMessage } from './utils'

describe('utils', () => {
	describe('parseWelcomeMessage', () => {
		test('should parse message properly', async () => {
			const message = parseWelcomeMessage('1234', 'Welcome {member}!\n@everyone feel free to introduce yourselves to each other.\n\n{member} optionally you may add an {channel:589662168430149642} if you\'d like.\nSome others have made their own as welland you can copy their format if you\'d like.\nYou\'re able to update it whenever!')
			expect(message).toEqual('Welcome <@1234>!\n@everyone feel free to introduce yourselves to each other.\n\n<@1234> optionally you may add an <#589662168430149642> if you\'d like.\nSome others have made their own as welland you can copy their format if you\'d like.\nYou\'re able to update it whenever!')
		})
	})
})
