import { Test, TestingModule } from '@nestjs/testing';

import { AiService } from '~libs/nest-core';
import { TranslateDto } from '~libs/dto/freq-words';

import { LanguagesService } from '../languages/languages.service';
import { ENGLISH_LANGUAGE_ENTITY, RUSSIAN_LANGUAGE_ENTITY } from '../languages/stubs/languages';

import { translatePrompt } from './prompts/translate.prompt';
import { TranslatorService } from './translator.service';

jest.mock('./prompts/translate.prompt');

describe('TranslatorService', () => {
	let service: TranslatorService;

	let aiService: AiService;
	let languagesService: LanguagesService;

	const aiServiceMock = {
		prompt: jest.fn(),
	};

	const languagesServiceMock = {
		getOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TranslatorService,
				{
					provide: AiService,
					useValue: aiServiceMock,
				},
				{
					provide: LanguagesService,
					useValue: languagesServiceMock,
				},
			],
		}).compile();

		service = module.get<TranslatorService>(TranslatorService);

		aiService = module.get<AiService>(AiService);
		languagesService = module.get<LanguagesService>(LanguagesService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('translate', () => {
		it('should send correct prompt', async () => {
			const prompt = 'mocked-prompt';
			const dto: TranslateDto = {
				from: ENGLISH_LANGUAGE_ENTITY.id,
				to: RUSSIAN_LANGUAGE_ENTITY.id,
				translate: 'Hello',
			};
			languagesService.getOne = jest
				.fn()
				.mockResolvedValueOnce(ENGLISH_LANGUAGE_ENTITY)
				.mockResolvedValueOnce(RUSSIAN_LANGUAGE_ENTITY);
			(translatePrompt as jest.Mock).mockReturnValue(prompt);

			await service.translate(dto);

			expect(translatePrompt).toHaveBeenCalledWith(
				ENGLISH_LANGUAGE_ENTITY.name,
				RUSSIAN_LANGUAGE_ENTITY.name,
				dto.translate
			);
			expect(aiService.prompt).toHaveBeenCalledWith(prompt);
		});
	});
});
