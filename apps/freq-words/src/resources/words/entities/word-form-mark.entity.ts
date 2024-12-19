import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { WordMark } from './word-mark.entity';
import { WordForm } from './word-form.entity';

@Entity()
export class WordFormMark {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 0 })
	count: number;

	@Column({ default: false })
	isLemma: boolean;

	@ManyToOne(() => WordMark, (wordMark) => wordMark.wordFormsMarks)
	wordMark: WordMark;

	@ManyToOne(() => WordForm, (wordForm) => wordForm.wordFormsMarks, { cascade: true })
	wordForm: WordForm;
}
