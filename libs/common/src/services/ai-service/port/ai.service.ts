export interface IAiOptions {
	jsonFormat: boolean;
	originality: number;
	maxTokens: number;
}

export abstract class AiService {
	protected abstract options: IAiOptions;
	abstract prompt(prompt: string, options?: Partial<IAiOptions>): Promise<string | null>;
}
