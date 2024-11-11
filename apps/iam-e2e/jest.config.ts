import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: 'e2e-spec.ts',
	coverageDirectory: 'coverage_e2e',
	moduleNameMapper: {
		// apps
		'^~/iam/prisma/(.*)$': '<rootDir>/../iam/prisma/$1',
		'^~/iam/(.*)$': '<rootDir>/../iam/src/$1',
		'^~/highlight-extension/prisma/(.*)$': '<rootDir>/../highlight-extension/prisma/$1',
		'^~/highlight-extension/(.*)$': '<rootDir>/../highlight-extension/src/$1',
		// libs
		'^~libs/common': '<rootDir>/../../libs/common/src',
		'^~libs/dto/(.*)$': '<rootDir>/../../libs/dto/src/$1',
		'^~libs/express-core/config$': '<rootDir>/../../libs/express-core/src/config',
		'^~libs/express-core': '<rootDir>/../../libs/express-core/src',
		'^~libs/routes/(.*)$': '<rootDir>/../../libs/routes/src/$1',
	},
};

export default config;
