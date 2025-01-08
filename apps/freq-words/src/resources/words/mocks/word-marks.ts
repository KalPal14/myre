import { DeepPartial } from 'typeorm';

import { WordMark } from '../entities/word-mark.entity';
import { WORKSPACE_ENTITY } from '../../workspaces/mocks/workspaces';

export const WORD_MARK_ENTITY: DeepPartial<WordMark> = {
	id: 1,
	count: 3,
	workspace: WORKSPACE_ENTITY,
};
