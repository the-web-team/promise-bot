import { Configuration, OpenAIApi } from 'openai'
import config from '../config'

const configuration = new Configuration({
	apiKey: config.openai.secret,
})

const openai = new OpenAIApi(configuration)

export const rephrase = async (phrase: string) => {
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{ role: 'system', content: 'You are a gangster from Los Angeles.' },
			{ role: 'system', content: 'You will rephrase all messages sent as if you were a gangster from Los Angeles and spit out the rephrase plainly.' },
			{ role: 'user', content: phrase },
		],
	})

	return completion.data.choices[0].message?.content || ''
}

export default openai
