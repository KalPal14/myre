import { DeepPartial } from 'typeorm';

import { Language } from '../entities/language.entity';

export const ENGLISH_LANGUAGE_ENTITY: DeepPartial<Language> = { id: 1, name: 'English' };

export const RUSSIAN_LANGUAGE_ENTITY: DeepPartial<Language> = { id: 2, name: 'Russian' };

export const URKAINIAN_LANGUAGE_ENTITY: DeepPartial<Language> = { id: 3, name: 'Ukrainian' };
