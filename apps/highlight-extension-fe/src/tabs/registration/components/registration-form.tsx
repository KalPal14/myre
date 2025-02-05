import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@chakra-ui/react';

import { USERS_URLS } from '~libs/routes/iam';
import { RegistrationDto } from '~libs/dto/iam';
import { IRegistrationRo } from '~libs/ro/iam';
import { chromeExtApi, HTTPError, httpErrHandler } from '~libs/common';
import { TextField, OutsideClickAlert } from '~libs/react-core';
import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { ICreateWorkspaceRo } from '~libs/ro/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';
import { openTab } from '~libs/client-core';

import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

export default function LoginForm(): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<RegistrationDto>();

	const [, setJwt] = useCrossExtState('jwt');
	const [, setCurrentUser] = useCrossExtState('currentUser');
	const [, setCurrentWorkspace] = useCrossExtState('currentWorkspace');

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit(formValues: RegistrationDto): Promise<void> {
		const registrationRo = await chromeExtApi.post<RegistrationDto, IRegistrationRo>(
			USERS_URLS.register,
			formValues
		);
		if (registrationRo instanceof HTTPError) {
			handleErr(registrationRo);
			return;
		}
		const { jwt, user, testMailUrl } = registrationRo;

		const workspace = await chromeExtApi.post<CreateWorkspaceDto, ICreateWorkspaceRo>(
			WORKSPACES_URLS.create,
			{ name: `${user.username}'s workspace`, colors: [] }
		);
		if (workspace instanceof HTTPError) {
			setErrAlertMsg('Something went wrong. Reload the page or try again later');
			return;
		}

		setJwt(jwt);
		setCurrentUser(user);
		setCurrentWorkspace(workspace);
		if (testMailUrl) {
			openTab(testMailUrl);
		}
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof RegistrationDto, {
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
				errors={errors.email}
				name="email"
				label="Email"
				placeholder="Please enter email"
			/>
			<TextField
				register={register}
				errors={errors.username}
				name="username"
				label="Username"
				placeholder="Please enter username"
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
