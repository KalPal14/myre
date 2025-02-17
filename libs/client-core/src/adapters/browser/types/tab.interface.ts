export interface ITab {
	id?: number;
	index: number;
	windowId?: number;
	openerTabId?: number;
	url?: string;
	title?: string;
	favIconUrl?: string;
	status?: string;
	discarded?: boolean;
	incognito: boolean;
	width?: number;
	height?: number;
	hidden?: boolean;
	sessionId?: string;
	cookieStoreId?: string;
	isArticle?: boolean;
	isInReaderMode?: boolean;
	attention?: boolean;
	successorTabId?: number;
}
