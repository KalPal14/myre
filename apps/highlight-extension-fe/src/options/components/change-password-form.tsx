import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import date from 'date-and-time';

import { USERS_FULL_URLS } from '~libs/routes/iam';

import TChangePasswordRo from '~/highlight-extension-fe/common/types/ro/users/change-password-form.type';
import ApiServise from '~/highlight-extension-fe/common/services/api.service';
import TextField from '~/highlight-extension-fe/common/ui/fields/text-field';
import AccordionForm from '~/highlight-extension-fe/common/ui/forms/accordion-form';
import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';
import IChangePasswordDto from '~/highlight-extension-fe/common/types/dto/users/change-password.interface';
import httpErrHandler from '~/highlight-extension-fe/errors/http-error/http-err-handler';

export interface IChangePasswordFormProps {
	passwordUpdatedAt: string | null;
	onSuccess: (passwordUpdatedAt: string) => void;
}

export default function ChangePasswordForm({
	passwordUpdatedAt,
	onSuccess,
}: IChangePasswordFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<TChangePasswordRo>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(formValues: TChangePasswordRo): Promise<boolean> {
		const resp = await new ApiServise().patch<TChangePasswordRo, IChangePasswordDto>(
			USERS_FULL_URLS.changePassword,
			formValues
		);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}
		onSuccess(resp.passwordUpdatedAt);
		toast({
			title: 'Password has been successfully changed',
			status: 'success',
		});
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof TChangePasswordRo, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to change password',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to change password',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	const accordionButtonText = passwordUpdatedAt
		? `Last update: ${date.format(new Date(passwordUpdatedAt), 'YYYY/MM/DD HH:mm')}`
		: 'Never updated';

	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={accordionButtonText}
			tooltipLabel="Edit"
			labelText="Password"
		>
			<>
				<TextField
					register={register}
					errors={errors.password}
					name="password"
					label="Current password"
					placeholder="Please enter your current password"
					type="password"
				/>
				<TextField
					register={register}
					errors={errors.newPassword}
					name="newPassword"
					label="New password"
					placeholder="Please enter a new password"
					type="password"
				/>
			</>
		</AccordionForm>
	);
}
