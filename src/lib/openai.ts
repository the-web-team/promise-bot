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
			{ role: 'system', content: 'You are a gamer that plays MMOs.' },
			{ role: 'user', content: `Rephrase this message, "${phrase}". Only give me back the rephrased message with no quotes.` },
		],
	})

	return completion.data.choices[0].message?.content
}

export default openai
