import path from 'node:path'
import fs from 'node:fs/promises'
import { parse } from 'yaml'

const config = {
	discord: {
		clientId: process.env.DISCORD_CLIENT_ID as string,
		clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		token: process.env.DISCORD_BOT_TOKEN as string,
	},
	openai: {
		secret: process.env.OPENAI_SECRET as string,
	},
	version: process.env.VERSION_SHA as string,
}

const ymlPath = path.join(__dirname, '..', 'guild_configs.yml')
export const guildConfigs = async (): Promise<Record<string, GuildConfig>> => {
	const guildConfigYaml = await fs.readFile(ymlPath, { encoding: 'utf-8' })
	return parse(guildConfigYaml)
}

export const getGuildConfig = async (guildId: string) => {
	const configs = await guildConfigs()
	return configs[`${guildId}`]
}

export default config
