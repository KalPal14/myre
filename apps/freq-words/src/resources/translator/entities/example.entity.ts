import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';

import { Definition } from './definition.entity';

@Entity()
export class Example {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Language, (language) => language.id)
	language: Language;

	@ManyToOne(() => Definition, (definition) => definition.id)
	definition: Definition;
}
