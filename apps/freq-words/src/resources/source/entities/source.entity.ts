import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { WordFormMark } from '../../word-marks/entities/word-form-mark.entity';
import { Workspace } from '../../workspaces/entities/workspace.entity';

@Entity()
export class Source {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	link: string;

	@ManyToOne(() => Workspace, (workspace) => workspace.sources)
	workspace: Workspace;

	@ManyToMany(() => WordFormMark, (wordFormMark) => wordFormMark.sources)
	wordFormMarks: WordFormMark[];
}
