import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Definition } from '~/freq-words/resources/word-forms/entities/definition.entity';
import { Workspace } from '~/freq-words/resources/workspaces/entities/workspace.entity';

import { WordForm } from '../../word-forms/entities/word-form.entity';

@Entity()
export class Language {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@OneToMany(() => WordForm, (wordForm) => wordForm.language)
	wordForms: WordForm[];

	@OneToMany(() => Definition, (definition) => definition.language)
	definitions: Definition[];

	@OneToMany(() => Workspace, (workspace) => workspace.knownLanguage)
	knownLanguageWorkspaces: Workspace[];

	@OneToMany(() => Workspace, (workspace) => workspace.targetLanguage)
	targetLanguageWorkspaces: Workspace[];
}
