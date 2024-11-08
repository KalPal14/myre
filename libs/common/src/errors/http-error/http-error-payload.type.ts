interface IErrorMsg {
	err: string;
}

interface IErrorValidation {
	errors: string[];
	property: string;
	value: string;
}

export type THttpErrorPayload = IErrorMsg | IErrorValidation[] | string;
