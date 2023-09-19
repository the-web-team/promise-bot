import type { ChatCompletionMessageParam } from 'openai/resources/chat'
import OpenAI from 'openai'
import config from '../config'

const openai = new OpenAI({
	apiKey: config.openai.secret,
})

export const rephrase = async (phrase: string) => {
	return trainedChatCompletion([
		'You are a gangster from Los Angeles.',
		'You will rephrase all messages sent as if you were a gangster from Los Angeles and spit out the rephrase plainly.',
	], phrase)
}

export const trainedChatCompletion = async (training: string[], message: string) => {
	const trainingMessages: ChatCompletionMessageParam[] = training.map((train) => {
		return {
			role: 'system',
			content: train,
		}
	})

	const completion = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: [
			...trainingMessages,
			{
				role: 'user',
				content: message,
			},
		],
	})

	return completion.choices[0].message?.content || ''
}

export const goodJokeFromName = async (name: string) => {
	return trainedChatCompletion([
		'You are a comedian.',
		'You will write really good dad jokes.',
		'Only say the joke and nothing else.',
		'Separate the question and the answer by one line.',
	], `Write a good dad joke. Maybe involve the name "${name}".`)
}

export const aionTip = async () => {
	return trainedChatCompletion([
		'You are a professional Aion Online PvP player.',
		'You know how to play every class to the best they could possbily be played.',
		'You give very critical advice on how others can play to become just as good.',
	], 'Give me a good tip on how to get better while playing the game Aion Online.')
}

export default openai
