import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.FREQ_WORDS_HOST,
			port: +process.env.FREQ_WORDS_DB_PORT!,
			username: process.env.FREQ_WORDS_DB_USERNAME,
			password: process.env.FREQ_WORDS_DB_PASSWORD,
			database: process.env.FREQ_WORDS_DB_NAME,
			autoLoadEntities: true,
			synchronize: process.env.NODE_ENV !== 'prod',
		}),
	],
})
export class DbModule {}
