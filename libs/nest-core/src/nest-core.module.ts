import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';

import { JwtAuthMiddleware } from './middlewares/jwt-auth/jwt-auth.middleware';
import { JwtService } from './services/jwt-service/jwt.service';
import { ValidationException } from './exceptions/validation.exception';

@Module({
	imports: [ConfigModule],
	providers: [
		JwtService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
				transform: true,
				exceptionFactory: (errors): ValidationException =>
					new ValidationException(
						errors.map(({ property, constraints }) => ({
							property,
							errors: Object.values(constraints ?? {}),
						}))
					),
				transformOptions: {
					enableImplicitConversion: true,
				},
			}),
		},
	],
})
export class NestCoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(JwtAuthMiddleware).forRoutes('*');
	}
}
