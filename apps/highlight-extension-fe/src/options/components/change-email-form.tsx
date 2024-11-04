import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { USERS_FULL_URLS } from '~libs/routes/iam';
import { ChangeEmailDto } from '~libs/dto/iam';
import { IChangeEmailRo } from '~libs/ro/iam';
import { httpErrHandler, HTTPError, chromeExtApi } from '~libs/common';

import TextField from '~/highlight-extension-fe/common/ui/fields/text-field';
import AccordionForm from '~/highlight-extension-fe/common/ui/forms/accordion-form';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';

export interface IChangeEmailFormProps {
	currentEmail: string;
	onSuccess: (email: string) => void;
}

export default function ChangeEmailForm({
	currentEmail,
	onSuccess,
}: IChangeEmailFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<ChangeEmailDto>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	const [, setJwt] = useCrossExtState('jwt');

	async function onSubmit(formValues: ChangeEmailDto): Promise<boolean> {
		const resp = await chromeExtApi.patch<ChangeEmailDto, IChangeEmailRo>(
			USERS_FULL_URLS.changeEmail,
			formValues
		);

		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}

		setJwt(resp.jwt);
		onSuccess(resp.email);
		toast({
			title: 'Email has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof ChangeEmailDto, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to change email',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to change email',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={currentEmail}
			tooltipLabel="Edit"
			labelText="Email"
		>
			<>
				<TextField
					register={register}
					errors={errors.newEmail}
					name="newEmail"
					label="New email"
					placeholder="Please enter your new email"
				/>
			</>
		</AccordionForm>
	);
}
