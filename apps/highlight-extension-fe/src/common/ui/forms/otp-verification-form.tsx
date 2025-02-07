import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Collapse } from '@chakra-ui/react';

import { OTP_URLS } from '~libs/routes/iam';
import { ValidateOtpDto } from '~libs/dto/iam';
import { IValidateOtpRo } from '~libs/ro/iam';
import { HTTPError, httpErrHandler } from '~libs/common';
import { TextField, OutsideClickAlert } from '~libs/react-core';

import { api } from '~/highlight-extension-fe/common/api/api';

export interface IEmailVerificationFormProps {
	email: string;
	onSuccess: () => void;
	onChangeEmailClick: () => void;
}

export default function OtpVerificationForm({
	email,
	onSuccess,
	onChangeEmailClick,
}: IEmailVerificationFormProps): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<Omit<ValidateOtpDto, 'email'>>();

	const [errAlerMsg, setErrAlertMsg] = useState<string | null>(null);

	async function onSubmit({ code }: Omit<ValidateOtpDto, 'email'>): Promise<void> {
		const validateOtpRo = await api.post<ValidateOtpDto, IValidateOtpRo>(OTP_URLS.validate, {
			code,
			email,
		});
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
				setErrAlertMsg(msg);
				return;
			},
			onValidationErr(property, err) {
				if (property === 'email') {
					setErrAlertMsg('We were unable to resend the code. Please try again');
				}
				setErrAlertMsg(err[0]);
			},
			onUnhandledErr() {
				setErrAlertMsg('We were unable to resend the code. Please try again');
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
			<Collapse
				in={Boolean(errAlerMsg)}
				animateOpacity
			>
				<OutsideClickAlert
					msg={errAlerMsg ?? ''}
					onClose={() => setErrAlertMsg(null)}
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
