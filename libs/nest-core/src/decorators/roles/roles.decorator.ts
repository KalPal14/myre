import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { TRole } from '~libs/common';

export const ROLES_KEY = 'role';

export const Roles = (...roles: TRole[]): CustomDecorator => SetMetadata(ROLES_KEY, roles);
