import React, { useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Heading } from '@chakra-ui/react';

import { PAGES_FULL_URLS, HIGHLIGHTS_FULL_URLS } from '~libs/routes/highlight-extension';
import { GetPageDto, IndividualUpdateHighlightsDto } from '~libs/dto/highlight-extension';
import {
	IBaseHighlightRo,
	IDeleteHighlightRo,
	IUpdateHighlightRo,
	TGetPageRo,
} from '~libs/ro/highlight-extension';

import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';
import ApiServise from '~/highlight-extension-fe/common/services/api.service';
import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';
import DraggableFields from '~/highlight-extension-fe/common/ui/fields/draggable-fields/draggable-fields';
import ICreatedHighlightExtState from '~/highlight-extension-fe/common/types/cross-ext-state/created-highlight-ext-state.interface';
import IDeletedHighlightExtState from '~/highlight-extension-fe/common/types/cross-ext-state/deleted-highlight-ext-state.interface';
import IUpdatedHighlightExtState from '~/highlight-extension-fe/common/types/cross-ext-state/updated-highlight-ext-state.interface';

import THighlightsTabName from '../types/highlights-tab-name.type';
import IChangeHighlightForm from '../types/change-highlight-form.interface';

import HighlightsListItem from './highlights-list-item';

export interface IHighlightsListProps {
	tabName: THighlightsTabName;
}

export default function HighlightsList({ tabName }: IHighlightsListProps): JSX.Element {
	const pageUrl = new URL(window.location.href).searchParams.get('url');
	const createdHighlightRerendersCount = useRef(0);

	const [createdHighlight] = useCrossExtState<ICreatedHighlightExtState | null>(
		'createdHighlight',
		null
	);
	const [deletedHighlight, setDeletedHighlight] =
		useCrossExtState<IDeletedHighlightExtState | null>('deletedHighlight', null);
	const [updatedHighlight] = useCrossExtState<IUpdatedHighlightExtState | null>(
		'updatedHighlight',
		null
	);
	const [unfoundHighlightsIds] = useCrossExtState<number[]>('unfoundHighlightsIds', []);
	const [currentWorkspace] = useCrossExtState<IBaseHighlightRo | null>('currentWorkspace', null);

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

		const resp = await new ApiServise().get<GetPageDto, TGetPageRo>(PAGES_FULL_URLS.get, {
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

		const resp = await new ApiServise().delete<null, IDeleteHighlightRo>(
			HIGHLIGHTS_FULL_URLS.delete(highlight.id)
		);
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

		await new ApiServise().patch<IndividualUpdateHighlightsDto, IUpdateHighlightRo[]>(
			HIGHLIGHTS_FULL_URLS.individualUpdateMany,
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
