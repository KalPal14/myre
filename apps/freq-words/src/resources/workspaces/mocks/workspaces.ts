import { DeepPartial } from 'typeorm';

import { Workspace } from '../entities/workspace.entity';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../../languages/mocks/languages';

export const WORKSPACE_ENTITY: DeepPartial<Workspace> = {
	id: 1,
	ownerId: 1,
	name: 'Russian - English',
	knownLanguage: ENGLISH_LANGUAGE_ENTITY,
	targetLanguage: RUSSIAN_LANGUAGE_ENTITY,
};
