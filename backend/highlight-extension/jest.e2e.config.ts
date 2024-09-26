import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testRegex: 'e2e-spec.ts',
	coverageDirectory: 'coverage_e2e',
	moduleNameMapper: {
		'@/(.*)$': '<rootDir>/src/$1',
	},
};

export default config;
