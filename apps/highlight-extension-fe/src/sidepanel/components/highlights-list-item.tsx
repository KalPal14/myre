import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Divider, Text, Tooltip } from '@chakra-ui/react';

import { IBaseHighlightRo } from '~libs/ro/highlight-extension';
import { ExclamationOctagonSVG } from '~libs/react-core';

import useCrossBrowserState from '~/highlight-extension-fe/common/hooks/cross-browser-state/cross-browser-state.hook';

import IChangeHighlightForm from '../types/change-highlight-form.interface';

export interface IHighlightsListItemProps {
	register: UseFormRegister<IChangeHighlightForm>;
	highlight: IBaseHighlightRo;
	index: number;
}

export default function HighlightsListItem({
	register,
	highlight,
	index,
}: IHighlightsListItemProps): JSX.Element {
	const [, setScrollHighlightId] = useCrossBrowserState('scrollHighlightId');
	const [unfoundHighlightsIds] = useCrossBrowserState('unfoundHighlightsIds');

	const unfoundHighlight = unfoundHighlightsIds.includes(highlight.id);

	return (
		<div
			{...register(`highlights.${index}`, {})}
			className="highlightsList_itemContent"
		>
			{unfoundHighlight && (
				<Tooltip label="This note is only in the sidebar">
					<div className="highlightsList_exclamationSvgContainer">
						<ExclamationOctagonSVG />
					</div>
				</Tooltip>
			)}
			<Text
				onClick={() => setScrollHighlightId(`web-highlight-${highlight.id}`)}
				cursor={unfoundHighlight ? 'text' : 'pointer'}
				fontSize="md"
				color={highlight.color}
			>
				{highlight.text}
			</Text>
			{highlight.note && (
				<>
					<Divider
						className="highlightsList_itemContentDivider"
						borderColor="gray.400"
					/>
					<Text
						fontSize="md"
						color="gray.400"
					>
						{highlight.note}
					</Text>
				</>
			)}
		</div>
	);
}
