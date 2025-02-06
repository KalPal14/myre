import React, { useEffect, useState } from 'react';
import { Accordion } from '@chakra-ui/react';

import { PAGES_URLS } from '~libs/routes/highlight-extension';
import { TGetPagesRo } from '~libs/ro/highlight-extension';
import { GetPagesDto } from '~libs/dto/highlight-extension';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

import PageItem from './page-item';

export default function PagesTab(): JSX.Element {
	const [currentWorkspace] = useCrossExtState('currentWorkspace');

	const [pages, setPages] = useState<TGetPagesRo>([]);

	useEffect(() => {
		getPagesInfo();
	}, [currentWorkspace]);

	async function getPagesInfo(): Promise<void> {
		if (!currentWorkspace) return;

		const resp = await api.get<GetPagesDto, TGetPagesRo>(PAGES_URLS.getPagesShortInfo, {
			workspaceId: currentWorkspace.id.toString(),
		});

		if (resp instanceof Error) return;
		setPages(resp.filter(({ highlightsCount }) => highlightsCount));
	}

	return (
		<section className="options_pagesTab">
			<Accordion allowMultiple>
				{pages.map((page) => (
					<PageItem
						key={page.id}
						page={page}
						onUpdatePage={getPagesInfo}
					/>
				))}
			</Accordion>
		</section>
	);
}
