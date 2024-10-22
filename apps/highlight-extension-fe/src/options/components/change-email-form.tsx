import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { USERS_FULL_URLS } from '~libs/routes/iam';

import TChangeEmailRo from '~/highlight-extension-fe/common/types/ro/users/change-email.type';
import ApiServise from '~/highlight-extension-fe/common/services/api.service';
import IChangeEmailDto from '~/highlight-extension-fe/common/types/dto/users/change-email.interface';
import TextField from '~/highlight-extension-fe/common/ui/fields/text-field';
import AccordionForm from '~/highlight-extension-fe/common/ui/forms/accordion-form';
import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';
import httpErrHandler from '~/highlight-extension-fe/errors/http-error/http-err-handler';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';

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
	const useFormReturnValue = useForm<TChangeEmailRo>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	const [, setJwt] = useCrossExtState<string | null>('jwt', null);

	async function onSubmit(formValues: TChangeEmailRo): Promise<boolean> {
		const resp = await new ApiServise().patch<TChangeEmailRo, IChangeEmailDto>(
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
				setError(property as keyof TChangeEmailRo, {
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
