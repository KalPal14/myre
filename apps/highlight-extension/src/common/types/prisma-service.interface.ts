import { IBasePrismaService } from '~libs/express-core';

import { PrismaClient } from '~/highlight-extension/prisma/client';

export type TPrismaService = IBasePrismaService<PrismaClient>;
