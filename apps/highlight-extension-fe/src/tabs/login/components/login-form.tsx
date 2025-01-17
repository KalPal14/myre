import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@chakra-ui/react';

import { USERS_URLS } from '~libs/routes/iam';
import { LoginDto } from '~libs/dto/iam';
import { ILoginRo } from '~libs/ro/iam';
import { TGetOwnersWorkspacesRo } from '~libs/ro/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';
import { chromeExtApi, httpErrHandler, HTTPError } from '~libs/common';
import { TextField, OutsideClickAlert } from '~libs/react-core';

import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

export default function LoginForm(): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<LoginDto>();

	const [, setJwt] = useCrossExtState('jwt');
	const [, setCurrentUser] = useCrossExtState('currentUser');
	const [, setCurrentWorkspace] = useCrossExtState('currentWorkspace');

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit(formValues: LoginDto): Promise<void> {
		const loginResp = await chromeExtApi.post<LoginDto, ILoginRo>(USERS_URLS.login, formValues);
		if (loginResp instanceof HTTPError) {
			handleErr(loginResp);
			return;
		}

		const { jwt, ...userData } = loginResp;

		const workspacesResp = await chromeExtApi.get<null, TGetOwnersWorkspacesRo>(
			WORKSPACES_URLS.getAllOwners,
			null,
			{ headers: { Authorization: `Bearer ${jwt}` } }
		);
		if (workspacesResp instanceof HTTPError) {
			handleErr(workspacesResp);
			return;
		}

		setJwt(jwt);
		setCurrentUser(userData);
		setCurrentWorkspace(workspacesResp[0]);
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof LoginDto, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				setErrAlertMsg(msg);
				return;
			},
			onUnhandledErr() {
				setErrAlertMsg('Something went wrong. Please try again');
			},
		});
	}

	function closeErrAlert(): void {
		setErrAlertMsg(null);
	}

	return (
		<form
			className="loginPage_form"
			onSubmit={handleSubmit(onSubmit)}
		>
			<TextField
				register={register}
				errors={errors.userIdentifier}
				name="userIdentifier"
				label="Email or username"
				placeholder="Please enter email or usernamee"
			/>
			<TextField
				register={register}
				errors={errors.password}
				name="password"
				label="Password"
				placeholder="Please enter your password"
				type="password"
			/>
			<Collapse
				in={Boolean(errAlerMsg)}
				animateOpacity
			>
				<OutsideClickAlert
					msg={errAlerMsg ?? ''}
					onClose={closeErrAlert}
					mb={5}
				/>
			</Collapse>
			<Button
				mt={2}
				colorScheme="teal"
				isLoading={isSubmitting}
				type="submit"
			>
				Submit
			</Button>
		</form>
	);
}
