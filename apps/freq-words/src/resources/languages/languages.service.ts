import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { GetLanguagesDto } from '~libs/dto/freq-words';

import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
	constructor(@InjectRepository(Language) private languageRepository: Repository<Language>) {}

	async getMany({ q }: GetLanguagesDto): Promise<Language[]> {
		return this.languageRepository.find({ where: q ? { name: ILike(`%${q}%`) } : undefined });
	}

	async getOne(id: number): Promise<Language> {
		const language = await this.languageRepository.findOne({ where: { id } });
		if (!language) {
			throw new NotFoundException({ err: `Language #${id} not found` });
		}
		return language;
	}
}
