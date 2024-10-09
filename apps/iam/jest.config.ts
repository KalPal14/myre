import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: 'spec.ts',
	coverageDirectory: 'coverage_unit',
	moduleNameMapper: {
		'^~/iam/prisma/(.*)$': '<rootDir>/prisma/$1',
		'^~/iam/(.*)$': '<rootDir>/src/$1',
		'^~libs/express-core': '<rootDir>/../../libs/express-core/src',
		'^~libs/common': '<rootDir>/../../libs/common/src',
		'^~libs/dto/(.*)$': '<rootDir>/../../libs/dto/src/$1',
	},
	modulePathIgnorePatterns: ['<rootDir>/test'],
};

export default config;
