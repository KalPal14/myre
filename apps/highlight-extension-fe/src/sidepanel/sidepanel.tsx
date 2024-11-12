import React from 'react';
import { Tooltip } from '@chakra-ui/react';

import { CogSVG } from '~libs/react-core';

import { FULL_OPTIONS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/options';
import { openTab } from '~libs/client-core';

import HighlightsListTabs from './components/highlights-list-tabs';

export default function Sidepanel(): JSX.Element {
	return (
		<main className="sidepanel">
			<header className="sidepanel_header">
				<Tooltip
					label="Settings"
					fontSize="md"
					placement="left"
				>
					<div>
						<CogSVG
							onClick={() => openTab(FULL_OPTIONS_ROUTES.pages)}
							height={28}
							width={28}
							cursor="pointer"
						/>
					</div>
				</Tooltip>
			</header>
			<section className="highlightsList">
				<HighlightsListTabs />
			</section>
		</main>
	);
}
