import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';
// import { Definition } from '~/freq-words/resources/translator/entities/definition.entity';

import { WordFormMark } from './word-form-mark.entity';

@Entity()
export class WordForm {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	isLemma: boolean;

	@ManyToOne(() => Language, (language) => language.wordForms)
	language: Language;

	@OneToMany(() => WordFormMark, (wordFormMark) => wordFormMark.wordForm)
	wordFormsMarks: WordFormMark[];

	// @OneToMany(() => Definition, (definition) => definition.wordForm)
	// dictionaries: Definition[];
}
