import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';
import { Definition } from '~/freq-words/resources/translator/entities/definition.entity';

import { Word } from './word.entity';
import { WordFormMark } from './word-form-mark.entity';

@Entity()
export class WordForm {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@ManyToOne(() => Language, (language) => language.id)
	language: Language;

	@ManyToOne(() => Word, (word) => word.id)
	word: Word;

	@OneToMany(() => Definition, (definition) => definition.wordForm)
	dictionaries: Definition[];

	@OneToMany(() => WordFormMark, (wordFormMark) => wordFormMark.wordForm)
	wordFormMarks: WordFormMark[];
}
