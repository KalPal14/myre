import React from 'react';
import { useToast } from '@chakra-ui/react';

import { USERS_URLS } from '~libs/routes/iam';
import { UpdateUserDto } from '~libs/dto/iam';
import { IUpdateUserRo } from '~libs/ro/iam';
import { httpErrHandler, HTTPError } from '~libs/common';
import { AccordionForm } from '~libs/react-core';

import { api } from '~/highlight-extension-fe/common/api/api';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state/cross-ext-state.hook';
import { toastDefOptions } from '~/highlight-extension-fe/common/constants/default-values/toast-options';
import OtpVerification from '~/highlight-extension-fe/common/ui/otp-verification/otp-verification';

export interface IChangeEmailFormProps {
	currentEmail: string;
	onSuccess: (email: string) => void;
}

export default function ChangeEmailForm({
	currentEmail,
	onSuccess,
}: IChangeEmailFormProps): JSX.Element {
	const toast = useToast(toastDefOptions);

	const [, setJwt] = useCrossExtState('jwt');

	async function onSubmit(formValues: UpdateUserDto): Promise<boolean> {
		const resp = await api.patch<UpdateUserDto, IUpdateUserRo>(USERS_URLS.update, formValues);

		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}

		setJwt(resp.jwt!);
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
			childrenType="form"
			onSubmitHandler={onSubmit}
			accordionButtonText={currentEmail}
			tooltipLabel="Edit"
			labelText="Email"
		>
			<OtpVerification onSuccess={onSubmit} />
		</AccordionForm>
	);
}
