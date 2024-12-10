import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Language } from '~/freq-words/languages/entities/language.entity';
import { WordMark } from '~/freq-words/words/entities/word-mark.entity';

@Entity()
export class Workspace {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	ownerId: number;

	@Column()
	name: string;

	@ManyToOne(() => Language, (language) => language.id)
	knownLanguage: Language;

	@ManyToOne(() => Language, (language) => language.id)
	targetLanguage: Language;

	@OneToMany(() => WordMark, (wordMark) => wordMark.workspace)
	wordsMarks: WordMark[];
}
