interface ITranslate {
	type: 'translation';
	translation: string[];
}
interface IDictionary {
	type: 'dictionary';
	translation: string[];
	synonyms: string[];
	from_description: string;
	to_description: string;
	examples: { from: string; to: string }[];
}

export type TTranslateRo = ITranslate | IDictionary;
