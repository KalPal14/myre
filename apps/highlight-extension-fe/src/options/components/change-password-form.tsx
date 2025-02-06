import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import date from 'date-and-time';

import { USERS_URLS } from '~libs/routes/iam';
import { UpdateUserDto } from '~libs/dto/iam';
import { httpErrHandler, HTTPError } from '~libs/common';
import { TextField, AccordionForm } from '~libs/react-core';
import { IUpdateUserRo } from '~libs/ro/iam';

import { api } from '~/highlight-extension-fe/common/api/api';

export interface IChangePasswordFormProps {
	passwordUpdatedAt: Date | null;
	onSuccess: (passwordUpdatedAt: Date) => void;
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
	const useFormReturnValue = useForm<UpdateUserDto>();
	const {
		register,
		formState: { errors },
		setError,
	} = useFormReturnValue;

	async function onSubmit(formValues: UpdateUserDto): Promise<boolean> {
		const resp = await api.patch<UpdateUserDto, IUpdateUserRo>(USERS_URLS.update, formValues);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}
		onSuccess(resp.passwordUpdatedAt!);
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
				setError(property as keyof UpdateUserDto, {
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
					errors={errors.password?.currentPassword}
					name="password.currentPassword"
					label="Current password"
					placeholder="Please enter your current password"
					type="password"
				/>
				<TextField
					register={register}
					errors={errors.password?.newPassword}
					name="password.newPassword"
					label="New password"
					placeholder="Please enter a new password"
					type="password"
				/>
			</>
		</AccordionForm>
	);
}
