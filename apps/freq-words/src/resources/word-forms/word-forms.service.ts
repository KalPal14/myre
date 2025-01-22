import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DefinitionDto } from '~libs/dto/freq-words/word-marks/common/definition.dto';

import { LanguagesService } from '../languages/languages.service';

import { Example } from './entities/example.entity';
import { WordForm } from './entities/word-form.entity';
import { Definition } from './entities/definition.entity';

@Injectable()
export class WordFormsService {
	constructor(
		@InjectRepository(WordForm) private wordFormRepository: Repository<WordForm>,
		@InjectRepository(Definition) private definitionRepository: Repository<Definition>,
		@InjectRepository(Example) private exampleRepository: Repository<Example>,
		private languagesService: LanguagesService
	) {}

	async getOrCreate(data: Pick<WordForm, 'language' | 'name'>): Promise<WordForm> {
		const existedWordForm = await this.wordFormRepository.findOneBy({
			name: data.name,
			language: data.language,
		});
		if (!existedWordForm) {
			const newWordForm = this.wordFormRepository.create(data);
			return this.wordFormRepository.save(newWordForm);
		}
		return existedWordForm;
	}

	async getOrCreateDefinition(
		{ languageId, examples, description, synonyms }: DefinitionDto,
		wordForm: WordForm
	): Promise<Definition> {
		const language = await this.languagesService.getOne(languageId);
		const existedDefinition = await this.definitionRepository.findOne({
			where: { language, wordForm },
		});
		if (!existedDefinition) {
			const examplesEntities = await this.exampleRepository.create(
				examples.map((example) => ({ phrase: example }))
			);
			const synonymsEntities = await Promise.all(
				synonyms.map((synonym) => this.getOrCreate({ language, name: synonym }))
			);
			const definitionEntity = this.definitionRepository.create({
				description,
				language,
				wordForm,
				examples: examplesEntities,
				synonyms: synonymsEntities,
			});
			return this.definitionRepository.save(definitionEntity);
		}
		return existedDefinition;
	}
}
