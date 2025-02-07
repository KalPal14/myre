import React from 'react';
import {
	FormControl,
	FormLabel,
	Input,
	FormErrorMessage,
	Text,
	InputRightElement,
	useBoolean,
	InputGroup,
	FormHelperText,
} from '@chakra-ui/react';
import { FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

import { EyeSlashSVG, EyeSVG } from '~libs/react-core';

export interface ITextFieldProps<FormFields extends FieldValues> {
	register: UseFormRegister<FormFields>;
	validationOptions?: RegisterOptions<FormFields>;
	errors: FieldError | undefined;
	name: Path<FormFields>;
	placeholder?: string;
	label?: string;
	type?: 'text' | 'password' | 'number';
	helperText?: string;
}

export function TextField<FormFields extends FieldValues>({
	register,
	validationOptions = {},
	errors,
	name,
	placeholder,
	label,
	type = 'text',
	helperText,
}: ITextFieldProps<FormFields>): JSX.Element {
	const [hideText, setHideText] = useBoolean(type === 'password');

	return (
		<FormControl isInvalid={Boolean(errors)}>
			<FormLabel
				htmlFor={name}
				mb={1}
				fontWeight={600}
			>
				{label}
			</FormLabel>
			<InputGroup>
				<Input
					id={name}
					placeholder={placeholder}
					{...register(name, validationOptions)}
					borderWidth={2}
					type={hideText ? 'password' : type === 'password' ? 'text' : type}
				></Input>
				{type === 'password' && (
					<InputRightElement onClick={setHideText.toggle}>
						{hideText ? <EyeSlashSVG /> : <EyeSVG />}
					</InputRightElement>
				)}
			</InputGroup>
			<FormErrorMessage
				fontSize="small"
				mt={1}
			>
				{errors && String(errors.message)}
			</FormErrorMessage>
			{!errors && helperText && <FormHelperText>{helperText}</FormHelperText>}
			{!errors && !helperText && (
				<Text
					className="ErrorMessagePlasePlug"
					fontSize="small"
					m={0}
				>
					<wbr />
				</Text>
			)}
		</FormControl>
	);
}
