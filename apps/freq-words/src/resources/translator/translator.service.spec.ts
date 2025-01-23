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
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('translate', () => {
		it('should send correct prompt', async () => {
			const prompt = 'mocked-prompt';
			const dto: TranslateDto = {
				from: ENGLISH_LANGUAGE_ENTITY.id!,
				to: RUSSIAN_LANGUAGE_ENTITY.id!,
				translate: 'Hello',
			};
			languagesServiceMock.getOne
				.mockResolvedValueOnce(ENGLISH_LANGUAGE_ENTITY)
				.mockResolvedValueOnce(RUSSIAN_LANGUAGE_ENTITY);
			(translatePrompt as jest.Mock).mockReturnValue(prompt);

			await service.translate(dto);

			expect(translatePrompt).toHaveBeenCalledWith(
				ENGLISH_LANGUAGE_ENTITY.name,
				RUSSIAN_LANGUAGE_ENTITY.name,
				dto.translate
			);
			expect(aiServiceMock.prompt).toHaveBeenCalledWith(prompt);
		});
	});
});
