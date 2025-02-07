import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@chakra-ui/react';

import { USERS_URLS } from '~libs/routes/iam';
import { RegistrationDto } from '~libs/dto/iam';
import { IRegistrationRo } from '~libs/ro/iam';
import { HTTPError, httpErrHandler } from '~libs/common';
import { TextField, OutsideClickAlert } from '~libs/react-core';
import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { ICreateWorkspaceRo } from '~libs/ro/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';
import { openTabDispatcher } from '~libs/client-core';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

export interface IRegistrationFormProps {
	email: string;
	onChangeEmailClick: () => void;
}

export default function RegistrationForm({
	email,
	onChangeEmailClick,
}: IRegistrationFormProps): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<Omit<RegistrationDto, 'email'>>();

	const [, setJwt] = useCrossExtState('jwt');
	const [, setCurrentUser] = useCrossExtState('currentUser');
	const [, setCurrentWorkspace] = useCrossExtState('currentWorkspace');

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit(formValues: Omit<RegistrationDto, 'email'>): Promise<void> {
		const registrationRo = await api.post<RegistrationDto, IRegistrationRo>(USERS_URLS.register, {
			email,
			...formValues,
		});
		if (registrationRo instanceof HTTPError) {
			handleErr(registrationRo);
			return;
		}
		const { jwt, user, testMailUrl } = registrationRo;

		const workspace = await api.post<CreateWorkspaceDto, ICreateWorkspaceRo>(
			WORKSPACES_URLS.create,
			{ name: `${user.username}'s workspace`, colors: [] },
			{ jwt }
		);
		if (workspace instanceof HTTPError) {
			setErrAlertMsg(
				'Your account was created successfully, but there was an error setting up your workspace. Please log in to try creating the workspace again.'
			);
			return;
		}

		setJwt(jwt);
		setCurrentUser(user);
		setCurrentWorkspace(workspace);
		if (testMailUrl) {
			openTabDispatcher({ url: testMailUrl });
		}
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof Omit<RegistrationDto, 'email'>, {
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
			className="registrationPage_form"
			onSubmit={handleSubmit(onSubmit)}
		>
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
			<Button
				mt={2}
				ml={1}
				colorScheme="gray"
				isLoading={isSubmitting}
				onClick={onChangeEmailClick}
			>
				Change Email
			</Button>
		</form>
	);
}
