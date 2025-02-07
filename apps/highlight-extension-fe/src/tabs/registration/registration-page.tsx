import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Heading } from '@chakra-ui/react';

import './registration.scss';

import { HighAlert } from '~libs/react-core';

import { TABS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/tabs';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';
import RequestOtpForm from '~/highlight-extension-fe/common/ui/forms/reqest-otp-form';

import OtpVerificationForm from '../../common/ui/forms/otp-verification-form';
import ResendOtpBtn from '../../common/ui/btn/resend-otp-btn';

import RegistrationForm from './components/registration-form';

export default function RegistrationPage(): JSX.Element {
	const [jwt] = useCrossExtState('jwt');

	const [registrationStep, setRegistrationStep] = useState(0);
	const [email, setEmail] = useState('');

	useEffect(() => {
		setRegistrationStep(0);
		setEmail('');
	}, [jwt]);

	function renderRegistrationStep(): JSX.Element {
		switch (registrationStep) {
			case 0:
				return (
					<RequestOtpForm
						email={email}
						onSuccess={(email) => {
							setEmail(email);
							setRegistrationStep(1);
						}}
						showErrIfUser="exists"
					/>
				);
			case 1:
				return (
					<>
						<OtpVerificationForm
							email={email}
							onSuccess={() => setRegistrationStep(2)}
							onChangeEmailClick={() => setRegistrationStep(0)}
						/>
						<ResendOtpBtn email={email} />
					</>
				);
			default:
				return <RegistrationForm email={email} />;
		}
	}

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
					{renderRegistrationStep()}
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
