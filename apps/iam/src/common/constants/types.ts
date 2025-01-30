import { EXPRESS_CORE_TYPES } from '~libs/express-core';

export const TYPES = {
	...EXPRESS_CORE_TYPES,

	App: Symbol('App'),

	OtpController: Symbol('OtpController'),
	OtpFactory: Symbol('OtpFactory'),
	OtpService: Symbol('OtpService'),
	OtpRepository: Symbol('OtpRepository'),

	UsersController: Symbol('UsersController'),
	UsersService: Symbol('UsersService'),
	UsersRepository: Symbol('UsersRepository'),
	UserFactory: Symbol('UserFactory'),
};
