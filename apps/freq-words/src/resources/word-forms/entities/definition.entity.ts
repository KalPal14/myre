import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';

import { Example } from './example.entity';
import { WordForm } from './word-form.entity';

@Entity()
export class Definition {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	description: string;

	@ManyToOne(() => Language, (language) => language.id, { eager: true })
	language: Language;

	@ManyToOne(() => WordForm, (wordForm) => wordForm.id)
	wordForm: WordForm;

	@ManyToMany(() => WordForm, { eager: true })
	@JoinTable({
		name: 'definition_synonyms',
		joinColumn: { name: 'definition_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'word_form_id', referencedColumnName: 'id' },
	})
	synonyms: WordForm[];

	@OneToMany(() => Example, (example) => example.definition, { eager: true, cascade: true })
	examples: Example[];
}
