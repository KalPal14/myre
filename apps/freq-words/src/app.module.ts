import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5430, // TODO: take from env
			username: 'postgres',
			password: 'postgres',
			database: 'postgres',
			autoLoadEntities: true,
			synchronize: true, // TODO: in dev true, in prod false
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
