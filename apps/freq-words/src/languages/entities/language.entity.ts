import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Dictionary } from '~/freq-words/translator/entities/dictionary.entity';
import { Example } from '~/freq-words/translator/entities/example.entity';
import { Workspace } from '~/freq-words/workspaces/entities/workspace.entity';

@Entity()
export class Language {
	@PrimaryColumn()
	id: number;

	@Column()
	name: string;

	@OneToMany(() => Example, (example) => example.language)
	examples: Example[];

	@OneToMany(() => Dictionary, (dictionary) => dictionary.language)
	dictionaries: Dictionary[];

	@OneToMany(() => Workspace, (workspace) => workspace.knownLanguage)
	knownLanguageWorkspaces: Workspace[];

	@OneToMany(() => Workspace, (workspace) => workspace.targetLanguage)
	targetLanguageWorkspaces: Workspace[];
}
