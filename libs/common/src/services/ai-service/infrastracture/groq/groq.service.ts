import Groq from 'groq-sdk';
import { ChatCompletionCreateParamsNonStreaming } from 'groq-sdk/resources/chat/completions.mjs';

import { AiService, IAiOptions } from '../../port/ai.service';

export class GroqService extends AiService {
	private groq: Groq;

	constructor(protected readonly options: IAiOptions) {
		super();
		this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
	}

	async prompt<ReturnType = string>(
		prompt: string,
		options?: Partial<IAiOptions>
	): Promise<ReturnType | null> {
		try {
			const groqOptions = this.buildPromptOptions(options);
			const completions = await this.groq.chat.completions.create({
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
				model: 'llama-3.3-70b-versatile',
				...groqOptions,
			});
			const response = completions.choices[0].message.content;
			if (!response) return null;
			return groqOptions.response_format?.type === 'json_object' ? JSON.parse(response) : response;
		} catch {
			return null;
		}
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
