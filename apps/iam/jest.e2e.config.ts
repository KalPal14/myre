import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: 'e2e-spec.ts',
	coverageDirectory: 'coverage_e2e',
	moduleNameMapper: {
		// apps
		'^~/iam/prisma/(.*)$': '<rootDir>/prisma/$1',
		'^~/iam/(.*)$': '<rootDir>/src/$1',
		// libs
		'^~libs/common': '<rootDir>/../../libs/common/src',
		'^~libs/dto/(.*)$': '<rootDir>/../../libs/dto/src/$1',
		'^~libs/express-core': '<rootDir>/../../libs/express-core/src',
		'^~libs/routes/(.*)$': '<rootDir>/../../libs/routes/src/$1',
	},
};

export default config;
