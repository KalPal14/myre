import { ICrossExtStateDescriptor } from './types/cross-ext-state-descriptor.interface';

export const DEFAULT_VALUES: ICrossExtStateDescriptor = {
	jwt: null,
	currentUser: null,
	currentWorkspace: null,
	isExtActive: true,
	createdHighlight: null,
	deletedHighlight: null,
	updatedHighlight: null,
	scrollHighlightId: null,
	unfoundHighlightsIds: [],
	updatedPages: { urls: [] },
};
