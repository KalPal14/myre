import { Injectable } from '@nestjs/common';

import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';

@Injectable()
export class WordsService {
	create(createWordDto: CreateWordDto): string {
		return 'This action adds a new word';
	}

	findAll(): string {
		return `This action returns all words`;
	}

	findOne(id: number): string {
		return `This action returns a #${id} word`;
	}

	update(id: number, updateWordDto: UpdateWordDto): string {
		return `This action updates a #${id} word`;
	}

	remove(id: number): string {
		return `This action removes a #${id} word`;
	}
}
