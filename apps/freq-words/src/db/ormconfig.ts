import { join } from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

import LanguageSeeder from './seeds/languages/language.seeder';
import WorkspaceSeeder from './seeds/workspaces/workspace.seeder';
import SourceSeeder from './seeds/sources/source.seeder';
import WordMarkSeeder from './seeds/word-marks/word-mark.seeder';
import WordFormMarkSeeder from './seeds/word-marks/word-form-mark.seeder';
import DefinitionSeeder from './seeds/translator/definition.seeder';
import ExampleSeeder from './seeds/translator/example.seeder';
import WordFormSeeder from './seeds/word-marks/word-form.seeder';

config({
	path: join(__dirname, `../../../../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: process.env.FREQ_WORDS_HOST,
	port: +process.env.FREQ_WORDS_DB_PORT,
	username: process.env.FREQ_WORDS_DB_USERNAME,
	password: process.env.FREQ_WORDS_DB_PASSWORD,
	database: process.env.FREQ_WORDS_DB_NAME,
	synchronize: process.env.NODE_ENV !== 'prod',
	entities: [join(__dirname, '..', 'resources', '**', 'entities', '*.entity.js')],
	migrations: [join(__dirname, 'migrations', '*.js')],
	seeds: [
		LanguageSeeder,
		WorkspaceSeeder,
		SourceSeeder,
		WordMarkSeeder,
		WordFormSeeder,
		WordFormMarkSeeder,
		DefinitionSeeder,
		ExampleSeeder,
	],
};

export const dataSource = new DataSource(options);
