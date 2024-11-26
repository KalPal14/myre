import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			exceptionFactory: (errors) =>
				new BadRequestException(
					errors.map(({ property, constraints }) => ({
						property,
						errors: Object.values(constraints ?? {}),
					}))
				),
			transformOptions: {
				enableImplicitConversion: true,
			},
		})
	);

	await app.listen(process.env.FREQ_WORDS_PORT!);
}
bootstrap();
