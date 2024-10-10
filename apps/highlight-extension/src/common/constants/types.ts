import { EXPRESS_CORE_TYPES } from '~libs/express-core';

export const TYPES = {
	...EXPRESS_CORE_TYPES,

	App: Symbol('App'),

	UsersController: Symbol('UsersController'),
	UsersService: Symbol('UsersService'),
	UsersRepository: Symbol('UsersRepository'),
	UserFactory: Symbol('UserFactory'),

	PagesController: Symbol('PagesController'),
	PagesServise: Symbol('PagesServise'),
	PagesRepository: Symbol('PagesRepository'),
	PageFactory: Symbol('PageFactory'),

	HighlightsController: Symbol('HighlightsController'),
	HighlightsService: Symbol('HighlightsService'),
	HighlightsRepository: Symbol('HighlightsRepository'),
	HighlightFactory: Symbol('HighlightFactory'),

	NodesService: Symbol('NodesService'),
	NodesRepository: Symbol('NodesRepository'),
	NodeFactory: Symbol('NodeFactory'),
};
