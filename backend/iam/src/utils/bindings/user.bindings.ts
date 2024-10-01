import { ContainerModule, interfaces } from 'inversify';

import TYPES from '@/common/constants/types.inversify';
import { UsersController } from '@/controllers/users-controller/users.controller';
import { IUsersController } from '@/controllers/users-controller/users.controller.interface';
import { UsersRepository } from '@/repositories/users-repository/users.repository';
import { IUsersRepository } from '@/repositories/users-repository/users.repository.interface';
import { UsersService } from '@/services/users-service/users.service';
import { IUsersService } from '@/services/users-service/users.service.interface';

export const userBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository);
	bind<IUsersService>(TYPES.UsersService).to(UsersService);
});
