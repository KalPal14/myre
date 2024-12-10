import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { WordMark } from './word-mark.entity';
import { WordForm } from './word-form.entity';

@Entity()
export class WordFormMark {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	count: number;

	@ManyToOne(() => WordMark, (wordMark) => wordMark.id)
	wordMark: WordMark;

	@ManyToOne(() => WordForm, (wordForm) => wordForm.id)
	wordForm: WordForm;
}
