import React, { useState, useEffect, useRef } from 'react';
import { union } from 'lodash';

import { HIGHLIGHTS_FULL_URLS } from '~libs/routes/highlight-extension';
import {
	IDeleteHighlightRo,
	IUpdateHighlightRo,
	TGetHighlightsRo,
} from '~libs/ro/highlight-extension';
import { GetHighlightsDto, UpdateHighlightDto } from '~libs/dto/highlight-extension';

import apiRequestDispatcher from '~/highlight-extension-fe/service-worker/handlers/api-request/api-request.dispatcher';
import IApiRequestOutcomeMsg from '~/highlight-extension-fe/service-worker/types/outcome-msgs/api-request.outcome-msg.interface';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';
import IDeletedHighlightExtState from '~/highlight-extension-fe/common/types/cross-ext-state/deleted-highlight-ext-state.interface';
import IUpdatedHighlightExtState from '~/highlight-extension-fe/common/types/cross-ext-state/updated-highlight-ext-state.interface';
import getPageUrl from '~/highlight-extension-fe/common/helpers/get-page-url.helper';

import getNestedHighlightsIds from '../helpers/to-receive-DOM-data/get-nested-highlights-Ids.helper';
import drawHighlight from '../helpers/for-DOM-changes/draw-highlight.helper';
import createRangeFromHighlightRo from '../helpers/for-DOM-changes/create-range-from-highlight-dto.helper';
import createHighlighterElement from '../helpers/for-DOM-changes/create-highlighter-element.helper';
import IHighlightElementData from '../types/highlight-element-data-interface';

import HighlightsController from './highlights-controller';

export default function InteractionWithHighlight(): JSX.Element {
	const [, setUpdatdHighlight] = useCrossExtState<IUpdatedHighlightExtState | null>(
		'updatedHighlight',
		null
	);
	const [deletedHighlight, setDeletedHighlight] =
		useCrossExtState<IDeletedHighlightExtState | null>('deletedHighlight', null);
	const [scrollHighlightId, setScrollHighlightId] = useCrossExtState<
		`web-highlight-${number}` | null
	>('scrollHighlightId', null);

	const highlightElementRef = useRef<IHighlightElementData | null>(null);
	const highlightElementToSetRef = useRef<IHighlightElementData | null>(null);

	const [currentHighlightElement, setCurrentHighlightElement] =
		useState<IHighlightElementData | null>(null);
	const [highlightElementSetDispatcher, setHighlightElementSetDispatcher] = useState(false);
	const [mouseСoordinates, setMouseСoordinates] = useState({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		document.addEventListener('click', onDocumentClickHandler);
		chrome.runtime.onMessage.addListener(apiResponseMsgHandler);

		return (): void => {
			document.removeEventListener('click', onDocumentClickHandler);
			chrome.runtime.onMessage.removeListener(apiResponseMsgHandler);
		};
	}, []);

	useEffect(() => {
		if (!deletedHighlight || deletedHighlight.pageUrl !== getPageUrl()) return;
		deleteHighlight(deletedHighlight.highlight);
	}, [deletedHighlight]);

	useEffect(() => {
		if (!scrollHighlightId) return;

		const scrollHighlights = document.querySelectorAll(`#${scrollHighlightId}`);
		const firsScrollHighlight = scrollHighlights[0];
		if (!firsScrollHighlight) return;

		const { y } = firsScrollHighlight.getBoundingClientRect();
		window.scrollTo({
			top: y + window.scrollY - 100,
			behavior: 'smooth',
		});
		makeHighlightEffect(scrollHighlights);
	}, [scrollHighlightId]);

	function makeHighlightEffect(highlights: NodeListOf<Element>): void {
		for (let i = 0; i < highlights.length; i++) {
			const highlight = highlights.item(i) as HTMLElement;
			const currentColor = highlight.style.backgroundColor;
			const effectColor = currentColor.replace(/[^,]+(?=\))/, '0.9');

			highlight.style.backgroundColor = effectColor;
			setTimeout(() => {
				highlight.style.backgroundColor = currentColor;
				setScrollHighlightId(null);
			}, 1000);
		}
	}

	useEffect(() => {
		setCurrentHighlightElement(highlightElementToSetRef.current);
		highlightElementRef.current = highlightElementToSetRef.current;
	}, [highlightElementSetDispatcher]);

	function onDocumentClickHandler(event: MouseEvent): void {
		const target = event.target as Element | null;
		if (!target) return;

		if (target.tagName === 'HIGHLIGHTS-EXT-CONTAINER') return;

		setCurrentHighlightElement(null);

		if (target.tagName === 'WEB-HIGHLIGHT') {
			onHighlightClickHandler(event);
			return;
		}
	}

	function onHighlightClickHandler({ target, clientX, pageY }: MouseEvent): void {
		if (!target) return;

		if (document.getSelection()?.type === 'Range') return;

		const higlightElement = target as HTMLElement;

		highlightElementToSetRef.current = {
			elementId: higlightElement.id,
			highlightId: Number(higlightElement.id.split('web-highlight-')[1]),
			color: higlightElement.style.backgroundColor,
			note: higlightElement.getAttribute('data-higlight-note'),
		};
		setHighlightElementSetDispatcher((prevState) => !prevState);
		setMouseСoordinates({
			x: clientX,
			y: pageY,
		});
	}

	function apiResponseMsgHandler({
		serviceWorkerHandler,
		contentScriptsHandler,
		data,
		incomeData,
	}: IApiRequestOutcomeMsg): void {
		if (serviceWorkerHandler !== 'apiRequest') return;
		switch (contentScriptsHandler) {
			case 'updateHighlightRespHandler':
				updateHighlightRespHandler(data as IUpdateHighlightRo, incomeData as UpdateHighlightDto);
				return;
			case 'deleteHighlightRespHandler':
				deleteHighlightRespHandler(data as IDeleteHighlightRo);
				return;
			case 'redrawErasedHighlights':
				redrawErasedHighlights(data as TGetHighlightsRo);
				return;
		}
	}

	function updateHighlightRespHandler(
		newHighlightData: IUpdateHighlightRo,
		incomeHighlightData: UpdateHighlightDto
	): void {
		if (!incomeHighlightData.text) {
			setUpdatdHighlight({ highlight: newHighlightData, pageUrl: getPageUrl() });
			updateHighlighterElement(newHighlightData);
		}
	}

	function updateHighlighterElement(highlight: IUpdateHighlightRo): void {
		const highlighterElements = document.querySelectorAll(`#web-highlight-${highlight.id}`);
		highlighterElements.forEach((highlighterElement) => {
			if (!highlighterElement.textContent) return;
			const newHighlighterElement = createHighlighterElement(
				highlighterElement.textContent,
				highlight
			);
			highlighterElement.replaceWith(newHighlighterElement);
		});
	}

	async function changeHighlightColor(color: string): Promise<void> {
		if (!currentHighlightElement) return;

		apiRequestDispatcher<UpdateHighlightDto>({
			contentScriptsHandler: 'updateHighlightRespHandler',
			url: HIGHLIGHTS_FULL_URLS.update(currentHighlightElement.highlightId),
			method: 'patch',
			data: { color },
		});
	}

	async function onControllerClose(color: string, note?: string): Promise<void> {
		if (!highlightElementRef.current) return;
		if (!note && !highlightElementRef.current.note) return;

		if (note !== highlightElementRef.current.note) {
			apiRequestDispatcher<UpdateHighlightDto>({
				contentScriptsHandler: 'updateHighlightRespHandler',
				url: HIGHLIGHTS_FULL_URLS.update(highlightElementRef.current.highlightId),
				method: 'patch',
				data: { note },
			});
		}
	}

	function onDeleteHighlight(): void {
		if (!currentHighlightElement) return;

		apiRequestDispatcher({
			contentScriptsHandler: 'deleteHighlightRespHandler',
			url: HIGHLIGHTS_FULL_URLS.delete(currentHighlightElement.highlightId),
			method: 'delete',
		});
	}

	function deleteHighlightRespHandler(highlight: IDeleteHighlightRo): void {
		setDeletedHighlight({ highlight, pageUrl: getPageUrl() });
		deleteHighlight(highlight);
	}

	function deleteHighlight(highlight: IDeleteHighlightRo): void {
		const nestedHighlightsIds: number[][] = [];

		const highlighterElements = document.querySelectorAll(`#web-highlight-${highlight.id}`);
		highlighterElements.forEach((highlighterElement) => {
			if (!highlighterElement.textContent) return;
			highlighterElement.outerHTML = highlighterElement.getAttribute('data-initial-text')!;

			const nestedToThisHighlightIds = getNestedHighlightsIds(highlighterElement);
			nestedHighlightsIds.push(nestedToThisHighlightIds);
		});

		apiRequestDispatcher<GetHighlightsDto>({
			contentScriptsHandler: 'redrawErasedHighlights',
			url: HIGHLIGHTS_FULL_URLS.getMany,
			method: 'get',
			data: {
				ids: JSON.stringify(union(...nestedHighlightsIds)),
			},
		});
		setCurrentHighlightElement(null);
	}

	function redrawErasedHighlights(highlights: TGetHighlightsRo): void {
		highlights.forEach((highlight) => {
			const highlightRange = createRangeFromHighlightRo(highlight);
			drawHighlight(highlightRange, highlight);
		});
	}

	if (currentHighlightElement) {
		return (
			<HighlightsController
				clientX={mouseСoordinates.x}
				pageY={mouseСoordinates.y}
				note={currentHighlightElement.note ?? undefined}
				forExistingHighlight={true}
				onSelectColor={changeHighlightColor}
				onControllerClose={onControllerClose}
				onDeleteClick={onDeleteHighlight}
			/>
		);
	}

	return <></>;
}
