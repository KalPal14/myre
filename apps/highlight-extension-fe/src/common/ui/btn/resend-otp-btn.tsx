import React from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useTimer } from 'react-timer-hook';

import { OTP_URLS } from '~libs/routes/iam';
import { UpsertOtpDto } from '~libs/dto/iam';
import { IUpsertOtpRo } from '~libs/ro/iam';
import { HTTPError, shiftTime, httpErrHandler } from '~libs/common';

import { api } from '~/highlight-extension-fe/common/api/api';

export interface IResendOtpBtnProps {
	email: string;
}

export default function ResendOtpBtn({ email }: IResendOtpBtnProps): JSX.Element {
	const { seconds, isRunning, restart } = useTimer({
		expiryTimestamp: shiftTime(30),
	});
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});

	async function resendCode(): Promise<void> {
		restart(shiftTime(30));

		const upsertOtpRo = await api.post<UpsertOtpDto, IUpsertOtpRo>(OTP_URLS.upsert, { email });
		if (upsertOtpRo instanceof HTTPError) {
			restart(new Date());
			handleErr(upsertOtpRo);
			return;
		}

		if (upsertOtpRo.testMailUrl) {
			window.open(upsertOtpRo.testMailUrl, '_blank');
		}
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onErrWithMsg(msg) {
				toast({ title: msg });
			},
			onValidationErr() {
				toast({ title: 'We were unable to resend the code. Please try again' });
			},
			onUnhandledErr() {
				toast({ title: 'We were unable to resend the code. Please try again' });
			},
		});
	}

	return (
		<Button
			mt={5}
			colorScheme="gray"
			isLoading={isRunning}
			loadingText={`Resend code in ${seconds}`}
			spinnerPlacement="end"
			onClick={resendCode}
		>
			Resend code
		</Button>
	);
}
