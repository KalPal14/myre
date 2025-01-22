import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';

import { WordFormMark } from '../../word-marks/entities/word-form-mark.entity';

import { Definition } from './definition.entity';

@Entity()
export class WordForm {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => Language, (language) => language.wordForms, { eager: true })
	language: Language;

	@OneToMany(() => WordFormMark, (wordFormMark) => wordFormMark.wordForm)
	wordFormMarks: WordFormMark[];

	@OneToMany(() => Definition, (definition) => definition.wordForm)
	definitions: Definition[];
}
