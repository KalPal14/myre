import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Heading } from '@chakra-ui/react';

import './registration.scss';

import { HighAlert } from '~libs/react-core';

import { TABS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/tabs';
import useCrossBrowserState from '~/highlight-extension-fe/common/hooks/cross-browser-state/cross-browser-state.hook';
import OtpVerification from '~/highlight-extension-fe/common/ui/otp-verification/otp-verification';

import RegistrationForm from './components/registration-form';

export default function RegistrationPage(): JSX.Element {
	const [jwt] = useCrossBrowserState('jwt');

	const [isOtpVerified, setIsOtpVerified] = useState(false);
	const [email, setEmail] = useState('');

	useEffect(() => {
		setIsOtpVerified(false);
		setEmail('');
	}, [jwt]);

	return (
		<div className="registrationPage">
			{!jwt && (
				<section className="registrationPage_formSection">
					<Heading as="h1">Registration</Heading>
					<Text>
						Want to log into an existing account?{' '}
						<Text
							color="teal.500"
							as="u"
							cursor="pointer"
						>
							<Link to={TABS_ROUTES.login}>Please login here</Link>
						</Text>
					</Text>
					{isOtpVerified ? (
						<RegistrationForm email={email} />
					) : (
						<OtpVerification
							onSuccess={({ email }) => {
								setEmail(email);
								setIsOtpVerified(true);
							}}
						/>
					)}
				</section>
			)}
			{Boolean(jwt) && (
				<HighAlert
					title="You have successfully registered"
					description="You can close this tab. To register a new account, please log out of the current on"
					status="success"
					className="registrationPage_alert"
				/>
			)}
		</div>
	);
}
