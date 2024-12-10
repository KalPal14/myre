import 'reflect-metadata';
import { join } from 'path';

import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { SeederOptions } from 'typeorm-extension';

config({
	path: join(__dirname, `../../../../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const options: DataSourceOptions & SeederOptions = {
	type: 'postgres',
	host: process.env.FREQ_WORDS_HOST,
	port: +process.env.FREQ_WORDS_DB_PORT!,
	username: process.env.FREQ_WORDS_DB_USERNAME,
	password: process.env.FREQ_WORDS_DB_PASSWORD,
	database: process.env.FREQ_WORDS_DB_NAME,
	synchronize: process.env.NODE_ENV !== 'prod',
	entities: [join(__dirname, '..', '**', '*.entity.js}')],
	migrations: [join(__dirname, 'migrations', '*.js')],
	seeds: [join(__dirname, 'seeds')],
};

export const dataSource = new DataSource(options);
