import React, { useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Heading } from '@chakra-ui/react';

import { HIGHLIGHTS_URLS, PAGES_URLS } from '~libs/routes/highlight-extension';
import { GetPageDto, IndividualUpdateHighlightsDto } from '~libs/dto/highlight-extension';
import { IDeleteHighlightRo, IUpdateHighlightRo, TGetPageRo } from '~libs/ro/highlight-extension';
import { HTTPError } from '~libs/common';
import { DraggableFields } from '~libs/react-core';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

import THighlightsTabName from '../types/highlights-tab-name.type';
import IChangeHighlightForm from '../types/change-highlight-form.interface';

import HighlightsListItem from './highlights-list-item';

export interface IHighlightsListProps {
	tabName: THighlightsTabName;
}

export default function HighlightsList({ tabName }: IHighlightsListProps): JSX.Element {
	const pageUrl = new URL(window.location.href).searchParams.get('url');
	const createdHighlightRerendersCount = useRef(0);

	const [createdHighlight] = useCrossExtState('createdHighlight');
	const [deletedHighlight, setDeletedHighlight] = useCrossExtState('deletedHighlight');
	const [updatedHighlight] = useCrossExtState('updatedHighlight');
	const [unfoundHighlightsIds] = useCrossExtState('unfoundHighlightsIds');
	const [currentWorkspace] = useCrossExtState('currentWorkspace');

	const { control, register, setValue, watch } = useForm<IChangeHighlightForm>({
		values: {
			highlights: [],
		},
	});
	const useFieldArrayReturn = useFieldArray({
		control,
		name: 'highlights',
	});
	const { fields, append, remove, update } = useFieldArrayReturn;

	useEffect(() => {
		if (createdHighlightRerendersCount.current <= 1) {
			createdHighlightRerendersCount.current++;
			return;
		}
		if (!createdHighlight || createdHighlight.pageUrl !== pageUrl) return;
		append({ highlight: createdHighlight.highlight });
	}, [createdHighlight]);

	useEffect(() => {
		if (!deletedHighlight || deletedHighlight.pageUrl !== pageUrl) return;
		const index = findFieldIndex(deletedHighlight.highlight.id);
		if (index === -1 || fields[index].highlight.id !== deletedHighlight.highlight.id) return;

		remove(index);
	}, [deletedHighlight]);

	useEffect(() => {
		if (!updatedHighlight || updatedHighlight.pageUrl !== pageUrl) return;
		const index = findFieldIndex(updatedHighlight.highlight.id);
		update(index, { highlight: updatedHighlight.highlight });
	}, [updatedHighlight]);

	useEffect(() => {
		getHighlights();
	}, [pageUrl, currentWorkspace]);

	function findFieldIndex(id: number): number {
		return fields.findIndex((field) => field.highlight.id === id);
	}

	async function getHighlights(): Promise<void> {
		if (!pageUrl || !currentWorkspace) {
			setValue('highlights', []);
			return;
		}

		const resp = await api.get<GetPageDto, TGetPageRo>(PAGES_URLS.get, {
			workspaceId: currentWorkspace.id.toString(),
			url: pageUrl,
		});
		if (resp instanceof HTTPError) return;
		if (resp.id === null) return;
		const highlights = resp.highlights?.map((highlight) => ({
			highlight,
		}));
		setValue('highlights', highlights ?? []);
	}

	async function onDeleteHighlight(index: number): Promise<void> {
		const { highlight } = fields[index];

		const resp = await api.delete<null, IDeleteHighlightRo>(HIGHLIGHTS_URLS.delete(highlight.id));
		if (resp instanceof HTTPError) return;
		setDeletedHighlight({ highlight: resp, pageUrl: pageUrl ?? '' });
	}

	async function onHighlightsSortEnd(): Promise<void> {
		const highlights = watch('highlights');
		const dataToUpdate = highlights
			.map(({ highlight: { order, id } }, index) => {
				if (order !== index + 1) {
					return { id, payload: { order: index + 1 } };
				}
				return null;
			})
			.filter((highlight) => highlight !== null);

		if (!dataToUpdate.length) return;

		await api.patch<IndividualUpdateHighlightsDto, IUpdateHighlightRo[]>(
			HIGHLIGHTS_URLS.individualUpdateMany,
			{
				highlights: dataToUpdate,
			}
		);
	}

	function getFieldsIdsByTab(): number[] {
		const highlightsIds = fields.map(({ highlight }) => highlight.id);
		switch (tabName) {
			case 'all':
				return highlightsIds;
			case 'found':
				return highlightsIds.filter((id) => isFound(id));
			case 'unfound':
				return highlightsIds.filter((id) => !isFound(id));
		}

		function isFound(id: number): boolean {
			return !unfoundHighlightsIds.includes(id);
		}
	}
	const fieldsIdsToRender = getFieldsIdsByTab();

	if (!fieldsIdsToRender.length) {
		return (
			<Heading
				as="h6"
				size="md"
				textAlign="center"
			>
				This list is empty
			</Heading>
		);
	}

	return (
		<DraggableFields
			useFieldArrayReturn={useFieldArrayReturn}
			showDeleteBtn={true}
			onDelete={onDeleteHighlight}
			onSortEnd={onHighlightsSortEnd}
			fieldsList={fields.map(({ highlight }, index) => {
				if (!fieldsIdsToRender.includes(highlight.id)) return null;
				return (
					<HighlightsListItem
						key={highlight.id}
						register={register}
						highlight={highlight}
						index={index}
					/>
				);
			})}
		/>
	);
}
