import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne } from 'typeorm/browser';

import { Language } from '~/freq-words/languages/entities/language.entity';

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
