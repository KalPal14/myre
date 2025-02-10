import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, useToast } from '@chakra-ui/react';

import { OTP_URLS } from '~libs/routes/iam';
import { ValidateOtpDto } from '~libs/dto/iam';
import { IValidateOtpRo } from '~libs/ro/iam';
import { HTTPError, httpErrHandler } from '~libs/common';
import { TextField } from '~libs/react-core';

import { api } from '~/highlight-extension-fe/common/api/api';

import { toastDefOptions } from '../../../constants/default-values/toast-options';

export interface IOtpVerificationFormProps {
	formControls: UseFormReturn<ValidateOtpDto>;
	onSuccess: () => void;
	onChangeEmailClick: () => void;
}

export default function OtpVerificationForm({
	formControls,
	onSuccess,
	onChangeEmailClick,
}: IOtpVerificationFormProps): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = formControls;
	const toast = useToast(toastDefOptions);

	async function onSubmit(formValue: ValidateOtpDto): Promise<void> {
		const validateOtpRo = await api.post<ValidateOtpDto, IValidateOtpRo>(
			OTP_URLS.validate,
			formValue
		);
		if (validateOtpRo instanceof HTTPError) {
			handleErr(validateOtpRo);
			return;
		}

		onSuccess();
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onErrWithMsg(msg) {
				toast({ title: msg });
				return;
			},
			onValidationErr(property, err) {
				if (property === 'email') {
					toast({ title: 'We were unable to resend the code. Please try again' });
				}
				setError(property as keyof Omit<ValidateOtpDto, 'email'>, { message: err.join() });
			},
			onUnhandledErr() {
				toast({ title: 'We were unable to resend the code. Please try again' });
			},
		});
	}

	return (
		<form
			className="registrationPage_form"
			onSubmit={handleSubmit(onSubmit)}
		>
			<TextField
				type="number"
				register={register}
				errors={errors.code}
				name="code"
				label="Email verification code"
				placeholder="Please enter here the code you received in the e-mail."
			/>
			<Button
				mt={2}
				colorScheme="teal"
				isLoading={isSubmitting}
				type="submit"
			>
				Submit
			</Button>
			<Button
				mt={2}
				ml={1}
				colorScheme="gray"
				isLoading={isSubmitting}
				onClick={onChangeEmailClick}
			>
				Change Email
			</Button>
		</form>
	);
}
