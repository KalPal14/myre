interface ITranslation {
	type: 'translation';
	translation: string[];
}

interface IDefinition {
	type: 'definition';
	lemma: string;
	translation: string[];
	synonyms: string[];
	from_description: string;
	to_description: string;
	examples: { from: string; to: string }[];
}

export type TTranslateRo = ITranslation | IDefinition;
