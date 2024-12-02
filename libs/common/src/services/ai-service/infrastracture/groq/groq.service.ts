import Groq from 'groq-sdk';
import { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions.mjs';

import { AiService, IAiOptions } from '../../port/ai.service';

export class GroqService extends AiService {
	private groq: Groq;

	constructor(protected readonly options: IAiOptions) {
		super();
		this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
	}

	async prompt(prompt: string, options?: Partial<IAiOptions>): Promise<string | null> {
		const groqOptions = this.buildPromptOptions(options);
		const groqResp = await this.groq.chat.completions.create({
			messages: [
				{
					role: 'user',
					content: prompt,
				},
			],
			model: 'llama3-8b-8192',
			...groqOptions,
		});
		return groqResp.choices[0].message.content;
	}

	private buildPromptOptions(
		options?: Partial<IAiOptions>
	): Omit<ChatCompletionCreateParamsNonStreaming, 'messages' | 'model'> {
		const groqOptions: Omit<ChatCompletionCreateParamsNonStreaming, 'messages' | 'model'> = {
			temperature: options?.originality ?? this.options.originality,
			max_tokens: options?.maxTokens ?? this.options.maxTokens,
		};
		if (options?.jsonFormat ?? this.options.jsonFormat) {
			groqOptions.response_format = { type: 'json_object' };
		}
		return groqOptions;
	}
}
