import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@chakra-ui/react';

import { USERS_FULL_URLS } from '~libs/routes/iam';
import { UsersLoginDto } from '~libs/dto/iam';
import { IBaseUserRo, ILoginRo } from '~libs/ro/iam';
import { IBaseWorkspaceRo, TGetOwnersWorkspacesRo } from '~libs/ro/highlight-extension';
import { WORKSPACES_FULL_URLS } from '~libs/routes/highlight-extension';

import ApiServise from '~/highlight-extension-fe/common/services/api.service';
import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';
import TextField from '~/highlight-extension-fe/common/ui/fields/text-field';
import OutsideClickAlert from '~/highlight-extension-fe/common/ui/alerts/outside-click-alert';
import httpErrHandler from '~/highlight-extension-fe/errors/http-error/http-err-handler';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';

export default function LoginForm(): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = useForm<UsersLoginDto>();

	const [, setJwt] = useCrossExtState<string | null>('jwt', null);
	const [, setCurrentUser] = useCrossExtState<IBaseUserRo | null>('currentUser', null);
	const [, setCurrentWorkspace] = useCrossExtState<IBaseWorkspaceRo | null>(
		'currentWorkspace',
		null
	);

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	// TODO: мне не нравиться как рядом выглядят UsersLoginDto и ILoginRo
	async function onSubmit(formValues: UsersLoginDto): Promise<void> {
		const loginResp = await new ApiServise().post<UsersLoginDto, ILoginRo>(
			USERS_FULL_URLS.login,
			formValues
		);
		if (loginResp instanceof HTTPError) {
			handleErr(loginResp);
			return;
		}

		const { jwt, ...userData } = loginResp;

		const workspacesResp = await new ApiServise({
			headers: { Authorization: `Bearer ${jwt}` },
		}).get<null, TGetOwnersWorkspacesRo>(WORKSPACES_FULL_URLS.getAllOwners);
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
				setError(property as keyof UsersLoginDto, {
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
