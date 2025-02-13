import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

import './popup.scss';

import { CogSVG } from '~libs/react-core';
import { openTab } from '~libs/client-core';

import { FULL_OPTIONS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/options';
import useCrossBrowserState from '~/highlight-extension-fe/common/hooks/cross-browser-state/cross-browser-state.hook';

import LoginSection from './components/login-section';

export default function Popup(): JSX.Element {
	const [jwt, setJwt] = useCrossBrowserState('jwt');
	const [, setCurrentUser] = useCrossBrowserState('currentUser');
	const [, setCurrentWorkspace] = useCrossBrowserState('currentWorkspace');
	const [isExtActive, setIsExtActive] = useCrossBrowserState('isExtActive');

	async function logout(): Promise<void> {
		setJwt(null);
		setCurrentUser(null);
		setCurrentWorkspace(null);
	}

	return (
		<div className="popup">
			<header className="popup_header">
				<Tooltip
					label="Settings"
					fontSize="md"
					placement="auto-end"
				>
					<div>
						<CogSVG
							onClick={() => openTab(FULL_OPTIONS_ROUTES.userInfo)}
							height={28}
							width={28}
							cursor="pointer"
						/>
					</div>
				</Tooltip>
			</header>
			<Button
				onClick={() => setIsExtActive((prev) => !prev)}
				colorScheme={isExtActive ? 'red' : 'teal'}
				className="popup_extButton"
			>
				{isExtActive ? 'Disable' : 'Enable'} extension
			</Button>
			{!jwt && <LoginSection />}
			{jwt && (
				<section className="popup_logout">
					<Button
						onClick={logout}
						colorScheme="teal"
						w="100%"
					>
						Log out
					</Button>
				</section>
			)}
		</div>
	);
}
