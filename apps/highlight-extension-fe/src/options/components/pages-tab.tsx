import React, { useEffect, useState } from 'react';
import { Accordion } from '@chakra-ui/react';

import { PAGES_FULL_URLS } from '~libs/routes/highlight-extension';
import { TGetPagesRo } from '~libs/ro/highlight-extension';

import ApiServise from '~/highlight-extension-fe/common/services/api.service';

import PageItem from './page-item';

export default function PagesTab(): JSX.Element {
	const [pages, setPages] = useState<TGetPagesRo>([]);

	useEffect(() => {
		getPagesInfo();
	}, []);

	async function getPagesInfo(): Promise<void> {
		const resp = await new ApiServise().get<null, TGetPagesRo>(PAGES_FULL_URLS.getPagesShortInfo);
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
