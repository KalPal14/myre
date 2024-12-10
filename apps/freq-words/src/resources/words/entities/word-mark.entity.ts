import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Workspace } from '~/freq-words/resources/workspaces/entities/workspace.entity';

import { WordFormMark } from './word-form-mark.entity';

@Entity()
export class WordMark {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	count: number;

	@ManyToOne(() => Workspace, (workspace) => workspace.id)
	workspace: Workspace;

	@OneToMany(() => WordFormMark, (wordFormMark) => wordFormMark.wordMark)
	wordFormMarks: WordFormMark[];
}
