import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Source } from '../../source/entities/source.entity';

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

	@ManyToOne(() => WordForm, (wordForm) => wordForm.wordFormsMarks, { eager: true })
	wordForm: WordForm;

	@ManyToMany(() => Source, (source) => source.wordFormsMarks, { eager: true })
	@JoinTable()
	sources: Source[];
}
