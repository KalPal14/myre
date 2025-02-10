import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ValidateOtpDto } from '~libs/dto/iam';

import RequestOtpForm from './components/reqest-otp-form';
import OtpVerificationForm from './components/otp-verification-form';
import ResendOtpBtn from './components/resend-otp-btn';

export interface IOtpVerificationFormProps {
	onSuccess: (data: Pick<ValidateOtpDto, 'email'>) => void;
}

export default function OtpVerification({ onSuccess }: IOtpVerificationFormProps): JSX.Element {
	const formControls = useForm<ValidateOtpDto>();
	const { getValues } = formControls;

	const [step, setStep] = useState(0);

	switch (step) {
		case 0:
			return (
				<RequestOtpForm
					formControls={formControls}
					onSuccess={() => setStep(1)}
					showErrIfUser="exists"
				/>
			);
		default:
			return (
				<>
					<OtpVerificationForm
						formControls={formControls}
						onSuccess={() => onSuccess({ email: getValues('email') })}
						onChangeEmailClick={() => setStep(0)}
					/>
					<ResendOtpBtn email={getValues('email')} />
				</>
			);
	}
}
