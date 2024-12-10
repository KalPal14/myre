import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { WordForm } from './word-form.entity';

@Entity()
export class Word {
	@PrimaryGeneratedColumn()
	id: number;

	@OneToOne(() => WordForm, (wordForm) => wordForm.word)
	@JoinColumn()
	lemma: WordForm;

	@OneToMany(() => WordForm, (wordForm) => wordForm.word)
	wordForms: WordForm[];
}
