import path from 'path';

import dotenv from 'dotenv';

export function configEnv(): void {
	const env = process.env.NODE_ENV || 'dev';
	const envFilePath = path.resolve(__dirname, `../../../.env.${env}`);

	const result = dotenv.config({ path: envFilePath });
	if (result.error || !result.parsed) {
		throw new Error(`Failed to load .env.${env} file`);
	}
}

configEnv();
