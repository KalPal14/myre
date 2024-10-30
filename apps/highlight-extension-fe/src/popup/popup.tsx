import React from 'react';
import { Button, Tooltip } from '@chakra-ui/react';

import './popup.scss';

import openTab from '~/highlight-extension-fe/common/helpers/open-tab.helper';
import { FULL_OPTIONS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/options';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

import CogSVG from '../assets/imgs/svg/cog';

import LoginSection from './components/login-section';

export default function Popup(): JSX.Element {
	const [jwt, setJwt] = useCrossExtState('jwt');
	const [, setCurrentUser] = useCrossExtState('currentUser');
	const [, setCurrentWorkspace] = useCrossExtState('currentWorkspace');
	const [isExtActive, setIsExtActive] = useCrossExtState('isExtActive');

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
