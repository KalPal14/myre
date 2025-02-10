import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { USERS_URLS } from '~libs/routes/iam';
import { httpErrHandler, HTTPError } from '~libs/common';
import { TextField, AccordionForm } from '~libs/react-core';
import { UpdateUserDto } from '~libs/dto/iam';
import { IUpdateUserRo } from '~libs/ro/iam';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';
import { toastDefOptions } from '~/highlight-extension-fe/common/constants/default-values/toast-options';

export interface IChangeusernameFormProps {
	currentUsername: string;
	onSuccess: (username: string) => void;
}

export default function ChangeUsernameForm({
	currentUsername,
	onSuccess,
}: IChangeusernameFormProps): JSX.Element {
	const toast = useToast(toastDefOptions);
	const formControls = useForm<UpdateUserDto>();
	const {
		register,
		formState: { errors },
		setError,
	} = formControls;

	const [, setJwt] = useCrossExtState('jwt');

	async function onSubmit(formValues: UpdateUserDto): Promise<boolean> {
		const resp = await api.patch<UpdateUserDto, IUpdateUserRo>(USERS_URLS.update, formValues);

		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}

		if (resp.jwt) {
			setJwt(resp.jwt);
		}
		onSuccess(resp.username);
		toast({
			title: 'Username has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof UpdateUserDto, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to change username',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to change username',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	return (
		<AccordionForm
			formControls={formControls}
			onSubmitHandler={onSubmit}
			accordionButtonText={currentUsername}
			tooltipLabel="Edit"
			labelText="Username"
		>
			<>
				<TextField
					register={register}
					errors={errors.username}
					name="username"
					label="New username"
					placeholder="Please enter your new username"
				/>
			</>
		</AccordionForm>
	);
}
