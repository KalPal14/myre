export interface ITranslateRo {
	translation: string[];
	synonyms?: string[];
	from_description?: string;
	to_description?: string;
	examples?: { from: string; to: string }[];
}
