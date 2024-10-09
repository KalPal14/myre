import { IBasePrismaService } from '~libs/express-core';

import { PrismaClient } from '~/iam/prisma/client';

export type TPrismaService = IBasePrismaService<PrismaClient>;
