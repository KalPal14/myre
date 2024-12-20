import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { WordFormMark } from '../../words/entities/word-form-mark.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity()
export class Source {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	link: string;

	@ManyToOne(() => Workspace, (workspace) => workspace.sources)
	workspace: Workspace;

	@OneToMany(() => WordFormMark, (wordFormMark) => wordFormMark.source)
	wordFormsMarks: WordFormMark[];
}
