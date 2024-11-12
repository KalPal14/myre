import React, { useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { isEqual } from 'lodash';

import { PAGES_FULL_URLS } from '~libs/routes/highlight-extension';
import { GetPageDto } from '~libs/dto/highlight-extension';
import { TGetPageRo, IBaseHighlightRo } from '~libs/ro/highlight-extension';
import { httpErrHandler, HTTPError } from '~libs/common';
import { apiHandler } from '~libs/client-core';

import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';
import getPageUrl from '~/highlight-extension-fe/common/helpers/get-page-url.helper';
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

	const [jwt] = useCrossExtState('jwt', null);
	const [, setUnfoundHighlightsIds] = useCrossExtState('unfoundHighlightsIds', []);
	const [updatedPages] = useCrossExtState('updatedPages');
	const [isExtActive] = useCrossExtState('isExtActive');
	const [currentWorkspace] = useCrossExtState('currentWorkspace');

	useEffect(() => {
		if (!isExtActive || !currentWorkspace) return;
		getPage(currentWorkspace.id);
	}, [isExtActive, currentWorkspace]);

	useEffect(() => {
		if (componentBeforeGettingPageInfo.current) return;
		if (jwt && isExtActive && currentWorkspace) {
			getPage(currentWorkspace.id);
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

	function getPage(workspaceId: number): void {
		apiHandler<GetPageDto, TGetPageRo>({
			msg: {
				method: 'get',
				url: PAGES_FULL_URLS.get,
				data: {
					workspaceId: workspaceId.toString(),
					url: getPageUrl(),
				},
			},
			onSuccess: getPageHandler,
			onError: getPageErrHandler,
		});
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
		componentBeforeGettingPageInfo.current = false;
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

		if (foundHighlights) {
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
