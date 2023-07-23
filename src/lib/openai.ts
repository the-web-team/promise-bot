import type { ChatCompletionRequestMessage } from 'openai'
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai'
import config from '../config'

const configuration = new Configuration({
	apiKey: config.openai.secret,
})

const openai = new OpenAIApi(configuration)

export const rephrase = async (phrase: string) => {
	return trainedChatCompletion([
		'You are a gangster from Los Angeles.',
		'You will rephrase all messages sent as if you were a gangster from Los Angeles and spit out the rephrase plainly.',
	], phrase)
}

export const trainedChatCompletion = async (training: string[], message: string) => {
	const completion = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: training.map<ChatCompletionRequestMessage>((train) => {
			return {
				role: ChatCompletionRequestMessageRoleEnum.System,
				content: train,
			}
		}).concat({
			role: ChatCompletionRequestMessageRoleEnum.User,
			content: message,
		}),
	})

	return completion.data.choices[0].message?.content || ''
}

export const goodJokeFromName = async (name: string) => {
	return trainedChatCompletion([
		'You are a comedian.',
		'You will write really good dad jokes.',
		'Only say the joke and nothing else.',
		'Separate the question and the answer by one line.'
	], `Write a good dad joke. Maybe involve the name "${name}".`)
}

export default openai
