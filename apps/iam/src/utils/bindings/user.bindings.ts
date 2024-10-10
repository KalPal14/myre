import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/iam/common/constants/types';
import { UsersController } from '~/iam/controllers/users-controller/users.controller';
import { IUsersController } from '~/iam/controllers/users-controller/users.controller.interface';
import { IUserFactory } from '~/iam/domain/user/factory/user-factory.interface';
import { UserFactory } from '~/iam/domain/user/factory/user.factory';
import { UsersRepository } from '~/iam/repositories/users-repository/users.repository';
import { IUsersRepository } from '~/iam/repositories/users-repository/users.repository.interface';
import { UsersService } from '~/iam/services/users-service/users.service';
import { IUsersService } from '~/iam/services/users-service/users.service.interface';

export const userBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository);
	bind<IUsersService>(TYPES.UsersService).to(UsersService);
	bind<IUserFactory>(TYPES.UserFactory).to(UserFactory);
});
