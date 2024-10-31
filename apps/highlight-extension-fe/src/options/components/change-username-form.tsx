import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { USERS_FULL_URLS } from '~libs/routes/iam';
import { ChangeUsernameDto } from '~libs/dto/iam';
import { IChangeUsernameRo } from '~libs/ro/iam';
import { httpErrHandler, HTTPError, patch } from '~libs/common';

import TextField from '~/highlight-extension-fe/common/ui/fields/text-field';
import AccordionForm from '~/highlight-extension-fe/common/ui/forms/accordion-form';

export interface IChangeusernameFormProps {
	currentUsername: string;
	onSuccess: (username: string) => void;
}

export default function ChangeUsernameForm({
	currentUsername,
	onSuccess,
}: IChangeusernameFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<ChangeUsernameDto>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(formValues: ChangeUsernameDto): Promise<boolean> {
		const resp = await patch<ChangeUsernameDto, IChangeUsernameRo>(
			USERS_FULL_URLS.changeUsername,
			formValues
		);

		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}

		await chrome.storage.local.set({
			token: resp.jwt,
		});
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
				setError(property as keyof ChangeUsernameDto, {
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
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={currentUsername}
			tooltipLabel="Edit"
			labelText="Username"
		>
			<>
				<TextField
					register={register}
					errors={errors.newUsername}
					name="newUsername"
					label="New username"
					placeholder="Please enter your new username"
				/>
			</>
		</AccordionForm>
	);
}
