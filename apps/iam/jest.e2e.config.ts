import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: 'e2e-spec.ts',
	coverageDirectory: 'coverage_e2e',
	moduleNameMapper: {
		'^~/iam/prisma(.*)$': '<rootDir>/prisma/$1',
		'^~/iam(.*)$': '<rootDir>/src/$1',
		'^~libs/express-core': '<rootDir>/../../libs/express-core/src',
	},
};

export default config;
