import { Injectable } from '@nestjs/common';

import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';

@Injectable()
export class LanguagesService {
	create(createLanguageDto: CreateLanguageDto): string {
		return 'This action adds a new language';
	}

	findAll(): string {
		return `This action returns all languages`;
	}

	findOne(id: number): string {
		return `This action returns a #${id} language`;
	}

	update(id: number, updateLanguageDto: UpdateLanguageDto): string {
		return `This action updates a #${id} language`;
	}

	remove(id: number): string {
		return `This action removes a #${id} language`;
	}
}
