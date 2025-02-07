import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, useToast } from '@chakra-ui/react';

import { USERS_URLS } from '~libs/routes/iam';
import { LoginDto } from '~libs/dto/iam';
import { ILoginRo } from '~libs/ro/iam';
import { ICreateWorkspaceRo, TGetOwnersWorkspacesRo } from '~libs/ro/highlight-extension';
import { WORKSPACES_URLS } from '~libs/routes/highlight-extension';
import { httpErrHandler, HTTPError } from '~libs/common';
import { TextField } from '~libs/react-core';
import { CreateWorkspaceDto } from '~libs/dto/highlight-extension';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';
import { toastDefOptions } from '~/highlight-extension-fe/common/constants/default-values/toast-options';

export default function LoginForm(): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<LoginDto>();
	const toast = useToast(toastDefOptions);

	const [, setJwt] = useCrossExtState('jwt');
	const [, setCurrentUser] = useCrossExtState('currentUser');
	const [, setCurrentWorkspace] = useCrossExtState('currentWorkspace');

	async function onSubmit(formValues: LoginDto): Promise<void> {
		const loginResp = await api.post<LoginDto, ILoginRo>(USERS_URLS.login, formValues);
		if (loginResp instanceof HTTPError) {
			handleErr(loginResp);
			return;
		}

		const { jwt, ...userData } = loginResp;

		const workspaces = await api.get<null, TGetOwnersWorkspacesRo>(
			WORKSPACES_URLS.getAllOwners,
			null,
			{ jwt }
		);
		if (workspaces instanceof HTTPError) {
			handleErr(workspaces);
			return;
		}

		if (!workspaces.length) {
			const workspace = await api.post<CreateWorkspaceDto, ICreateWorkspaceRo>(
				WORKSPACES_URLS.create,
				{ name: `${userData.username}'s workspace`, colors: [] },
				{ jwt }
			);
			if (workspace instanceof HTTPError) {
				toast({ title: 'Something went wrong. Reload the page or try again later' });
				return;
			}

			setJwt(jwt);
			setCurrentUser(userData);
			setCurrentWorkspace(workspace);
			return;
		}

		setJwt(jwt);
		setCurrentUser(userData);
		setCurrentWorkspace(workspaces[0]);
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
