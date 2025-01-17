import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { HIGHLIGHTS_URLS } from '~libs/routes/highlight-extension';
import { ICreateHighlightRo } from '~libs/ro/highlight-extension';
import { httpErrHandler, HTTPError } from '~libs/common';
import { apiHandler, getPageUrl } from '~libs/client-core';
import { Toast } from '~libs/react-core';

import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

import drawHighlight from '../helpers/for-DOM-changes/draw-highlight.helper';
import createRangeFromHighlightRo from '../helpers/for-DOM-changes/create-range-from-highlight-dto.helper';
import buildCreateHighlightDto from '../helpers/build-create-highlight-ro.helper';

import HighlightsController from './highlights-controller';

export default function CreateHighlight(): JSX.Element {
	const [, setCreatedHighlight] = useCrossExtState('createdHighlight');
	const [currentWorkspace] = useCrossExtState('currentWorkspace');

	const [selectedRange, setSelectedRange] = useState<Range | null>(null);
	const [mouseСoordinates, setMouseСoordinates] = useState({
		x: 0,
		y: 0,
	});

	useEffect(() => {
		document.addEventListener('mouseup', selectionHandler);

		return (): void => {
			document.removeEventListener('mouseup', selectionHandler);
		};
	}, []);

	function selectionHandler({ target, clientX, pageY }: MouseEvent): void {
		if ((target as HTMLElement).id === 'highlights-ext-container') return;

		const newSelection = document.getSelection();
		if (!newSelection || newSelection.type !== 'Range') {
			setSelectedRange(null);
			return;
		}

		const newRange = newSelection.getRangeAt(0);
		setSelectedRange(newRange);
		setMouseСoordinates({
			x: clientX,
			y: pageY,
		});
	}

	async function createHighlight(color: string, note?: string): Promise<void> {
		if (!selectedRange) return;
		if (!currentWorkspace) {
			toast(
				<Toast
					title="Error creating highlight"
					description="user is not authorised"
				/>
			);
			return;
		}

		const newHighlightData = buildCreateHighlightDto(
			currentWorkspace.id,
			selectedRange,
			color,
			note
		);
		if (!newHighlightData) {
			return;
		}

		apiHandler({
			msg: {
				url: HIGHLIGHTS_URLS.create,
				method: 'post',
				data: newHighlightData,
			},
			onSuccess: createHighlightRespHandler,
			onError: createHighlightErrHandler,
		});
	}

	function createHighlightRespHandler(highlight: ICreateHighlightRo): void {
		setCreatedHighlight({ highlight, pageUrl: getPageUrl() });
		const highlightRange = createRangeFromHighlightRo(highlight);
		drawHighlight(highlightRange, highlight);
		setSelectedRange(null);
	}

	function createHighlightErrHandler(err: HTTPError): void {
		httpErrHandler({
			err,
			onErrWithMsg(msg) {
				toast(
					<Toast
						title="Error creating highlight"
						description={msg}
					/>
				);
			},
			onUnhandledErr() {
				toast(
					<Toast
						title="Error creating highlight"
						description="Please reload the page or try again later"
					/>
				);
			},
		});
	}

	async function onControllerClose(color: string, note?: string): Promise<void> {
		if (note) {
			await createHighlight(color, note);
		}
	}

	if (selectedRange) {
		return (
			<HighlightsController
				clientX={mouseСoordinates.x}
				pageY={mouseСoordinates.y}
				onSelectColor={createHighlight}
				onControllerClose={onControllerClose}
			/>
		);
	}

	return <></>;
}
