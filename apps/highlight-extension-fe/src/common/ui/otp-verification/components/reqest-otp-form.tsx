import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, useToast } from '@chakra-ui/react';

import { OTP_URLS, USERS_URLS } from '~libs/routes/iam';
import { UpsertOtpDto, UserExistenceCheckDto, ValidateOtpDto } from '~libs/dto/iam';
import { IUpsertOtpRo, TUserExictanceCheck } from '~libs/ro/iam';
import { HTTPError, httpErrHandler } from '~libs/common';
import { TextField } from '~libs/react-core';

import { api } from '~/highlight-extension-fe/common/api/api';
import { toastDefOptions } from '~/highlight-extension-fe/common/constants/default-values/toast-options';

interface IRequestOtpFormProps {
	formControls: UseFormReturn<ValidateOtpDto>;
	onSuccess: () => void;
	showErrIfUser?: 'exists' | 'not exists';
}

export default function RequestOtpForm({
	formControls,
	showErrIfUser,
	onSuccess,
}: IRequestOtpFormProps): JSX.Element {
	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
		setError,
	} = formControls;
	const toast = useToast(toastDefOptions);

	async function onSubmit({ email }: UpsertOtpDto): Promise<void> {
		if (await checkUser({ email })) return;

		const upsertOtpRo = await api.post<UpsertOtpDto, IUpsertOtpRo>(OTP_URLS.upsert, { email });
		if (upsertOtpRo instanceof HTTPError) {
			handleErr(upsertOtpRo);
			return;
		}

		if (upsertOtpRo.testMailUrl) {
			window.open(upsertOtpRo.testMailUrl, '_blank');
		}
		onSuccess();
	}

	async function checkUser(data: UserExistenceCheckDto): Promise<boolean> {
		if (showErrIfUser === undefined) return true;

		const isUserExist = await api.get<UserExistenceCheckDto, TUserExictanceCheck>(
			USERS_URLS.exictanceCheck,
			data
		);

		if (isUserExist instanceof HTTPError) {
			handleErr(isUserExist);
			return false;
		}
		switch (showErrIfUser) {
			case 'exists':
				if (isUserExist) {
					toast({ title: 'User with this email already exists' });
				}
				return isUserExist;
			case 'not exists':
				if (!isUserExist) {
					toast({ title: 'User with this email already exists' });
				}
				return !isUserExist;
		}
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof UpsertOtpDto, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({ title: msg });
				return;
			},
			onUnhandledErr() {
				toast({ title: 'Something went wrong. Please try again' });
			},
		});
	}

	return (
		<form
			className="registrationPage_form"
			onSubmit={handleSubmit(onSubmit)}
		>
			<TextField
				register={register}
				errors={errors.email}
				name="email"
				label="Email"
				placeholder="Please enter email"
			/>
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
