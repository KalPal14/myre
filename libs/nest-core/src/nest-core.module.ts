import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtAuthMiddleware } from './middlewares/jwt-auth/jwt-auth.middleware';
import { JwtService } from './services/jwt-service/jwt.service';

@Module({
	imports: [ConfigModule],
	providers: [JwtService],
})
export class NestCoreModule implements NestModule {
	configure(consumer: MiddlewareConsumer): void {
		consumer.apply(JwtAuthMiddleware).forRoutes('*');
	}
}
