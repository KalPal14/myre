import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRegex: 'e2e-spec.ts',
	coverageDirectory: 'coverage',
	moduleNameMapper: {
		// apps,
		'^~/freq-words/(.*)$': '<rootDir>/../freq-words/src/$1',
		'^~/iam/prisma/(.*)$': '<rootDir>/../iam/prisma/$1',
		'^~/iam/(.*)$': '<rootDir>/../iam/src/$1',
		// libs
		'^~libs/common': '<rootDir>/../../libs/common/src',
		'^~libs/dto/(.*)$': '<rootDir>/../../libs/dto/src/$1',
		'^~libs/express-core': '<rootDir>/../../libs/express-core/src',
		'^~libs/routes/(.*)$': '<rootDir>/../../libs/routes/src/$1',
		'^~libs/nest-core': '<rootDir>/../../libs/nest-core/src',
	},
};

export default config;
