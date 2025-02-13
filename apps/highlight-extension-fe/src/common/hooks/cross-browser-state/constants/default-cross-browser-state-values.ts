import { ICrossBrowserStateDescriptor } from '../types/cross-browser-state-values.interface';

export const defaultCrossBrowserStateValues: ICrossBrowserStateDescriptor = {
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
