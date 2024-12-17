import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// import { Definition } from '~/freq-words/resources/translator/entities/definition.entity';
// import { Example } from '~/freq-words/resources/translator/entities/example.entity';
import { Workspace } from '~/freq-words/resources/workspaces/entities/workspace.entity';

import { WordForm } from '../../words/entities/word-form.entity';

@Entity()
export class Language {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	name: string;

	@OneToMany(() => WordForm, (wordForm) => wordForm.language)
	wordForms: WordForm[];

	// @OneToMany(() => Example, (example) => example.language)
	// examples: Example[];

	// @OneToMany(() => Definition, (definition) => definition.language)
	// dictionaries: Definition[];

	@OneToMany(() => Workspace, (workspace) => workspace.knownLanguage)
	knownLanguageWorkspaces: Workspace[];

	@OneToMany(() => Workspace, (workspace) => workspace.targetLanguage)
	targetLanguageWorkspaces: Workspace[];
}
