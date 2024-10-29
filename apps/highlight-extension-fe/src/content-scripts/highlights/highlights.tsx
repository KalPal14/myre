import React, { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { isEqual } from 'lodash';

import { PAGES_FULL_URLS } from '~libs/routes/highlight-extension';
import { GetPageDto } from '~libs/dto/highlight-extension';
import { TGetPageRo, IBaseHighlightRo, IBaseWorkspaceRo } from '~libs/ro/highlight-extension';

import apiRequestDispatcher from '~/highlight-extension-fe/service-worker/handlers/api-request/api-request.dispatcher';
import IApiRequestOutcomeMsg from '~/highlight-extension-fe/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';
import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';
import httpErrHandler from '~/highlight-extension-fe/errors/http-error/http-err-handler';
import getPageUrl from '~/highlight-extension-fe/common/helpers/get-page-url.helper';
import IUpdatedPagesUrlsExtState from '~/highlight-extension-fe/common/types/cross-ext-state/updated-pages-urls-ext-state.interface';
import setSidepanelDispatcher from '~/highlight-extension-fe/service-worker/handlers/set-sidepanel/open-sidepanel.dispatcher';

import Toast from '../common/ui/toasts/toast';

import InteractionWithHighlight from './components/interaction-with-highlight';
import drawHighlight from './helpers/for-DOM-changes/draw-highlight.helper';
import createRangeFromHighlightRo from './helpers/for-DOM-changes/create-range-from-highlight-dto.helper';
import CreateHighlight from './components/create-highlight';

export default function Highlights(): JSX.Element {
	const componentBeforeGettingPageInfo = useRef(true);
	const updatedPagesUrlsRerendersCount = useRef(0);
	const prevHighlights = useRef<IBaseHighlightRo[] | null>(null);

	const [jwt] = useCrossExtState<null | string>('jwt', null);
	const [, setUnfoundHighlightsIds] = useCrossExtState<number[]>('unfoundHighlightsIds', []);
	const [updatedPages] = useCrossExtState<IUpdatedPagesUrlsExtState>('updatedPages', {
		urls: [],
	});
	const [isExtActive] = useCrossExtState<boolean>('isExtActive', true);
	const [currentWorkspace] = useCrossExtState<IBaseWorkspaceRo | null>('currentWorkspace', null);

	useEffect(() => {
		if (!isExtActive || !currentWorkspace) return;
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);
		apiRequestDispatcher<GetPageDto>({
			contentScriptsHandler: 'getPageHandler',
			method: 'get',
			url: PAGES_FULL_URLS.get,
			data: {
				workspaceId: currentWorkspace.id.toString(),
				url: getPageUrl(),
			},
		});

		return (): void => {
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, [isExtActive, currentWorkspace]);

	useEffect(() => {
		if (componentBeforeGettingPageInfo.current) return;
		if (jwt && isExtActive && currentWorkspace) {
			apiRequestDispatcher<GetPageDto>({
				contentScriptsHandler: 'getPageHandler',
				method: 'get',
				url: PAGES_FULL_URLS.get,
				data: {
					workspaceId: currentWorkspace.id.toString(),
					url: getPageUrl(),
				},
			});
		}

		if (!isExtActive) {
			setSidepanelDispatcher({ url: getPageUrl(), enabled: false });
		}
		if (!jwt || !isExtActive) {
			const highlights = document.getElementsByTagName('WEB-HIGHLIGHT');
			if (!highlights.length) {
				toast(
					<Toast
						title="Error getting page information"
						description="User is not authorized"
					/>
				);
				return;
			}
			window.location.reload();
		}
	}, [jwt, isExtActive, currentWorkspace]);

	useEffect(() => {
		if (updatedPagesUrlsRerendersCount.current <= 1) {
			updatedPagesUrlsRerendersCount.current++;
			return;
		}
		const pageUrl = getPageUrl();
		if (updatedPages.urls.includes(pageUrl)) {
			setSidepanelDispatcher({ url: getPageUrl(), enabled: false });
			window.location.reload();
		}
	}, [updatedPages]);

	function apiResponseMsgHandler({
		serviceWorkerHandler,
		contentScriptsHandler,
		data,
		isDataHttpError,
	}: IApiRequestOutcomeMsg): void {
		if (serviceWorkerHandler !== 'apiRequest') return;
		switch (contentScriptsHandler) {
			case 'getPageHandler':
				if (isDataHttpError) {
					getPageErrHandler(data as HTTPError);
					return;
				}
				getPageHandler(data as TGetPageRo);
				componentBeforeGettingPageInfo.current = false;
				return;
		}
	}

	function getPageErrHandler(err: HTTPError): void {
		httpErrHandler({
			err,
			onErrWithMsg(msg) {
				toast(
					<Toast
						title="Error getting page information"
						description={msg}
					/>
				);
			},
			onUnhandledErr() {
				toast(
					<Toast
						title="Error getting page information"
						description="Please reload the page or try again later"
					/>
				);
			},
		});
	}

	function getPageHandler(page: TGetPageRo): void {
		if (page.id === null) return;
		drawHighlightsFromDto(page.highlights);
	}

	function drawHighlightsFromDto(highlights: IBaseHighlightRo[] | null): void {
		if (!highlights) return;
		if (isEqual(prevHighlights.current, highlights)) return;
		prevHighlights.current = highlights;

		const newUnfoundHighlightsIds: number[] = [];

		highlights.forEach((highlight) => {
			try {
				const highlightRange = createRangeFromHighlightRo(highlight);
				if (highlightRange.toString() !== highlight.text) {
					newUnfoundHighlightsIds.push(highlight.id);
					return;
				}
				drawHighlight(highlightRange, highlight);
			} catch {
				newUnfoundHighlightsIds.push(highlight.id);
			}
		});

		renderInfoToasts(highlights.length, newUnfoundHighlightsIds.length);
		setUnfoundHighlightsIds((prevState) => [...prevState, ...newUnfoundHighlightsIds]);
	}

	function renderInfoToasts(allHighlights: number, unfoundHighlights: number): void {
		const foundHighlights = allHighlights - unfoundHighlights;
		{
			// TODO
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			foundHighlights &&
				toast(
					<Toast
						status="success"
						title={`${foundHighlights} highlight${foundHighlights > 1 ? 's' : ''} successfully found in text`}
					/>
				);
		}
		if (unfoundHighlights) {
			toast(
				<Toast
					status="warning"
					title={`${unfoundHighlights} highlight${unfoundHighlights > 1 ? 's' : ''} not found in text`}
					description="You can see them by opening the sidepanel"
				/>
			);
		}
	}

	return (
		<main>
			{isExtActive && (
				<>
					<Toaster position="bottom-center" />
					<CreateHighlight />
					<InteractionWithHighlight />
				</>
			)}
		</main>
	);
}
