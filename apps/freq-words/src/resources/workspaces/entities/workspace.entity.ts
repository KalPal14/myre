import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Language } from '~/freq-words/resources/languages/entities/language.entity';
import { WordMark } from '~/freq-words/resources/words/entities/word-mark.entity';

import { Source } from '../../source/entities/source.entity';

@Entity()
export class Workspace {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	ownerId: number;

	@Column()
	name: string;

	@ManyToOne(() => Language, (language) => language.knownLanguageWorkspaces)
	knownLanguage: Language;

	@ManyToOne(() => Language, (language) => language.targetLanguageWorkspaces)
	targetLanguage: Language;

	@OneToMany(() => WordMark, (wordMark) => wordMark.workspace)
	wordsMarks: WordMark[];

	@OneToMany(() => Source, (source) => source.workspace)
	sources: Source[];
}
