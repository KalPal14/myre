import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';

import { Dictionary } from './dictionary.entity';

@Entity()
export class Example {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Language, (language) => language.id)
	language: Language;

	@ManyToOne(() => Dictionary, (dictionary) => dictionary.id)
	dictionary: Dictionary;
}
