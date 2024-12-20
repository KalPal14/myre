import { LANGUAGE_RUSSIAN } from '../../languages/mocks/languages';
import { SOURCE } from '../../source/mocks/sources';
import { Workspace } from '../entities/workspace.entity';

export const WORKSPACE: Workspace = {
	id: 1,
	ownerId: 1,
	name: 'Russian-English',
	knownLanguage: LANGUAGE_RUSSIAN,
	targetLanguage: LANGUAGE_RUSSIAN,
	wordsMarks: [],
	sources: [SOURCE],
};
