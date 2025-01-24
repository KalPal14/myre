import { randomUUID } from 'crypto';

import { DeepPartial } from 'typeorm';

import { GetOrCreateSourceDto } from '~libs/dto/freq-words';

import { WORKSPACE_ENTITY } from '../../workspaces/stubs/workspaces';
import { Source } from '../entities/source.entity';

export const SOURCE_ENTITY: DeepPartial<Source> = {
	id: 1,
	link: 'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%BF%D0%BE%D1%80%D0%BE%D0%B6%D1%8C%D0%B5',
	workspace: WORKSPACE_ENTITY,
};

export const GET_OR_CREATE_SOURCE_DTO = (existed?: boolean): GetOrCreateSourceDto => {
	return {
		link: existed ? SOURCE_ENTITY.link : `${SOURCE_ENTITY.link}/${randomUUID()}`,
		workspaceId: WORKSPACE_ENTITY.id,
	};
};
