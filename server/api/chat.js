import { streamText, convertToCoreMessages } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod';
export default defineEventHandler(async (event) => {
	const openai = createOpenAI({ apiKey: process.env.OPEN_AI })
	const messages = [{ role:"user", content:"What's the weather in Rome?"}]
	const result = await streamText({
		model: openai('gpt-4o-mini'),
		messages: convertToCoreMessages(messages),
		// system: system_prompt,
		experimental_toolCallStreaming: true,
		maxSteps: 5, // multi-steps for server-side tools
		tools: {
			get_weather: {
				description: `Get the weather for a city`,
				parameters: z.object({
					city: z.array(z.string()).describe('The name of the city'),
				}),
				execute: async ({ city }) => {
					return "It's about 15 degrees"
				}
			}
		}
	})
	return result.toDataStreamResponse()
})