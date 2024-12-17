import { IDefinitionRo } from './common/definition.ro';

interface ITranslationType {
	type: 'translation';
	translation: string[];
}

interface IDefinitionType {
	type: 'definition';
	lemma: string | null;
	definitionFrom: IDefinitionRo;
	definitionTo: IDefinitionRo;
}

export type TTranslateRo = ITranslationType | IDefinitionType;
