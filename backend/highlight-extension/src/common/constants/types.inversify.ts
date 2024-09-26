const TYPES = {
	App: Symbol('App'),

	LoggerService: Symbol('LoggerService'),
	ConfigService: Symbol('ConfigService'),
	PrismaService: Symbol('PrismaService'),

	ExceptionFilter: Symbol('ExceptionFilter'),

	UsersController: Symbol('UsersController'),
	UsersService: Symbol('UsersService'),
	UsersRepository: Symbol('UsersRepository'),

	PagesController: Symbol('PagesController'),
	PagesServise: Symbol('PagesServise'),
	PagesRepository: Symbol('PagesRepository'),

	HighlightsController: Symbol('HighlightsController'),
	HighlightsService: Symbol('HighlightsService'),
	HighlightsRepository: Symbol('HighlightsRepository'),

	NodesService: Symbol('NodesService'),
	NodesRepository: Symbol('NodesRepository'),
};

export default TYPES;
