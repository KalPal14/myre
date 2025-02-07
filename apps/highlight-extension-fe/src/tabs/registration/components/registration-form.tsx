import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, useToast } from '@chakra-ui/react';

import { USERS_URLS } from '~libs/routes/iam';
import { RegistrationDto } from '~libs/dto/iam';
import { IRegistrationRo } from '~libs/ro/iam';
import { HTTPError, httpErrHandler } from '~libs/common';
import { TextField } from '~libs/react-core';
import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';
import { ICreateWorkspaceRo } from '~libs/ro/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';
import { toastDefOptions } from '~/highlight-extension-fe/common/constants/default-values/toast-options';

export interface IRegistrationFormProps {
	email: string;
}

export default function RegistrationForm({ email }: IRegistrationFormProps): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<Omit<RegistrationDto, 'email'>>();
	const toast = useToast(toastDefOptions);

	const [, setJwt] = useCrossExtState('jwt');
	const [, setCurrentUser] = useCrossExtState('currentUser');
	const [, setCurrentWorkspace] = useCrossExtState('currentWorkspace');

	async function onSubmit(formValues: Omit<RegistrationDto, 'email'>): Promise<void> {
		const registrationRo = await api.post<RegistrationDto, IRegistrationRo>(USERS_URLS.register, {
			email,
			...formValues,
		});
		if (registrationRo instanceof HTTPError) {
			handleErr(registrationRo);
			return;
		}
		const { jwt, user } = registrationRo;

		const workspace = await api.post<CreateWorkspaceDto, ICreateWorkspaceRo>(
			WORKSPACES_URLS.create,
			{ name: `${user.username}'s workspace`, colors: [] },
			{ jwt }
		);
		if (workspace instanceof HTTPError) {
			toast({
				title:
					'Your account was created successfully, but there was an error setting up your workspace. Please log in to try creating the workspace again.',
			});
			return;
		}

		setJwt(jwt);
		setCurrentUser(user);
		setCurrentWorkspace(workspace);
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
				toast({ title: msg });
				return;
			},
			onUnhandledErr() {
				toast({ title: 'Something went wrong. Please try again' });
			},
		});
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
