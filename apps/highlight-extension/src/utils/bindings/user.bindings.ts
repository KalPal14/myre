import { ContainerModule, interfaces } from 'inversify';

import { TYPES } from '~/highlight-extension/common/constants/types';
import { UsersController } from '~/highlight-extension/controllers/users-controller/users.controller';
import { IUsersController } from '~/highlight-extension/controllers/users-controller/users.controller.interface';
import { IUserFactory } from '~/highlight-extension/domain/user/factory/user-factory.interface';
import { UserFactory } from '~/highlight-extension/domain/user/factory/user.factory';
import { UsersRepository } from '~/highlight-extension/repositories/users-repository/users.repository';
import { IUsersRepository } from '~/highlight-extension/repositories/users-repository/users.repository.interface';
import { UsersService } from '~/highlight-extension/services/users-service/users.service';
import { IUsersService } from '~/highlight-extension/services/users-service/users.service.interface';

export const userBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUsersController>(TYPES.UsersController).to(UsersController);
	bind<IUsersRepository>(TYPES.UsersRepository).to(UsersRepository);
	bind<IUsersService>(TYPES.UsersService).to(UsersService);
	bind<IUserFactory>(TYPES.UserFactory).to(UserFactory);
});
