import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { TABS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/tabs';

import LoginPage from './login/login-page';
import RegistrationPage from './registration/registration-page';

export default function Tabs(): JSX.Element {
	return (
		<Routes>
			<Route
				path={TABS_ROUTES.login}
				element={<LoginPage />}
			/>
			<Route
				path={TABS_ROUTES.registration}
				element={<RegistrationPage />}
			/>
		</Routes>
	);
}
