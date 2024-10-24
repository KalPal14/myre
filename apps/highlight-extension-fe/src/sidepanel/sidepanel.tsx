import React from 'react';
import { Tooltip } from '@chakra-ui/react';

import { FULL_OPTIONS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/options';
import openTab from '~/highlight-extension-fe/common/helpers/open-tab.helper';

import CogSVG from '../assets/imgs/svg/cog';

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
					<CogSVG
						onClick={() => openTab(FULL_OPTIONS_ROUTES.pages)}
						height={28}
						width={28}
						cursor="pointer"
					/>
				</Tooltip>
			</header>
			<section className="highlightsList">
				<HighlightsListTabs />
			</section>
		</main>
	);
}
