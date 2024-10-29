import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@chakra-ui/react';

import { USERS_FULL_URLS } from '~libs/routes/iam';
import { RegistrationDto } from '~libs/dto/iam';
import { IBaseUserRo, IRegistrationRo } from '~libs/ro/iam';
import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';

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
	} = useForm<RegistrationDto>();

	const [, setJwt] = useCrossExtState<string | null>('jwt', null);
	const [, setCurrentUser] = useCrossExtState<IBaseUserRo | null>('currentUser', null);
	const [, setCurrentWorkspace] = useCrossExtState<IBaseWorkspaceRo | null>(
		'currentWorkspace',
		null
	);

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit(formValues: RegistrationDto): Promise<void> {
		const resp = await new ApiServise().post<RegistrationDto, IRegistrationRo>(
			USERS_FULL_URLS.register,
			formValues
		);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return;
		}

		const { jwt, user, workspace } = resp;
		setJwt(jwt);
		setCurrentUser(user);
		setCurrentWorkspace(workspace);
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
