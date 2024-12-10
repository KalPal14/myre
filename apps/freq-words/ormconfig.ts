import 'reflect-metadata';
import { join, resolve } from 'path';

import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '../../../.env.dev') });

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.FREQ_WORDS_HOST,
	port: +process.env.FREQ_WORDS_DB_PORT!,
	username: process.env.FREQ_WORDS_DB_USERNAME,
	password: process.env.FREQ_WORDS_DB_PASSWORD,
	database: process.env.FREQ_WORDS_DB_NAME,
	entities: [join(__dirname, 'src', '**', '*.entity.js}')],
	migrations: [join(__dirname, 'src', 'migrations', '*.js')],
});
