import React, { useEffect, useState } from 'react';
import {
	Alert,
	AlertIcon,
	Heading,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from '@chakra-ui/react';

import { getUrlSearchParam, setUrlSearchParam } from '~libs/client-core';

import useCrossBrowserState from '~/highlight-extension-fe/common/hooks/cross-browser-state/cross-browser-state.hook';

import tabsList from './constants/tabs-list';

const OptionsPage = (): JSX.Element => {
	const [currentUser] = useCrossBrowserState('currentUser');
	const [currentWorkspace] = useCrossBrowserState('currentWorkspace');
	const [activeTabIndex, setActiveTabIndex] = useState(0);

	useEffect(() => {
		const tabParam = getUrlSearchParam('tab');
		if (!tabParam) return;

		const tabIndex = tabsList.findIndex(({ searchParam }) => searchParam === tabParam);
		if (tabIndex === -1) return;

		setActiveTabIndex(tabIndex);
	}, []);

	function onTabChange(newParam: string, newIndex: number): void {
		setUrlSearchParam('tab', newParam);
		setActiveTabIndex(newIndex);
	}

	return (
		<section className="options">
			<Heading
				as="h1"
				size="2xl"
				mb={5}
			>
				Settings
			</Heading>
			<Tabs index={activeTabIndex}>
				<TabList>
					{tabsList.map(({ name, searchParam }, index) => (
						<Tab
							key={index}
							onClick={() => onTabChange(searchParam, index)}
						>
							{name}
						</Tab>
					))}
				</TabList>

				{(!currentUser || !currentWorkspace) && (
					<TabPanels>
						<Alert
							status="warning"
							mt={3}
						>
							<AlertIcon />
							Sorry. We were unable to load your information. Make sure you are logged in.
						</Alert>
					</TabPanels>
				)}

				{currentUser && currentWorkspace && (
					<TabPanels>
						{tabsList.map(({ element }, index) => (
							<TabPanel key={index}>{element}</TabPanel>
						))}
					</TabPanels>
				)}
			</Tabs>
		</section>
	);
};

export default OptionsPage;
