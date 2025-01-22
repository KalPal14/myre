import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Workspace } from '~/freq-words/resources/workspaces/entities/workspace.entity';

import { WordFormMark } from './word-form-mark.entity';

@Entity()
export class WordMark {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: 0 })
	count: number;

	@ManyToOne(() => Workspace, (workspace) => workspace.wordsMarks)
	workspace: Workspace;

	@OneToMany(() => WordFormMark, (wordFormMark) => wordFormMark.wordMark, {
		eager: true,
	})
	wordFormMarks: WordFormMark[];
}
