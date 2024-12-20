import { PartialType } from '@nestjs/mapped-types';

import { GetOrCreateSourceDto } from './get-or-create-source.dto';

export class UpdateSourceDto extends PartialType(GetOrCreateSourceDto) {}
