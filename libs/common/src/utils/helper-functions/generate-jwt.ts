import { sign } from 'jsonwebtoken';

import { IJwtPayload } from '~libs/common/types/jwt-payload.interface';

export async function generateJwt(
	{ id, email, username }: IJwtPayload,
	jwtKey: string
): Promise<string> {
	return new Promise((resolve, reject) => {
		sign(
			{ id, email, username },
			jwtKey,
			{
				algorithm: 'HS256',
			},
			(err, token) => {
				if (err) {
					reject(err.message);
				} else {
					resolve(token as string);
				}
			}
		);
	});
}
