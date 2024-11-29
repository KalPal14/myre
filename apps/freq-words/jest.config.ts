import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: 'spec.ts',
	coverageDirectory: 'coverage',
	moduleNameMapper: {
		'^~/freq-words/(.*)$': '<rootDir>/src/$1',
		'^~libs/express-core': '<rootDir>/../../libs/express-core/src',
		'^~libs/nest-core': '<rootDir>/../../libs/nest-core/src',
		'^~libs/common': '<rootDir>/../../libs/common/src',
		'^~libs/dto/(.*)$': '<rootDir>/../../libs/dto/src/$1',
	},
	modulePathIgnorePatterns: ['<rootDir>/test'],
};

export default config;
