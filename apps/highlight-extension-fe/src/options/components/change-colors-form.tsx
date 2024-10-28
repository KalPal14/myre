import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';

import { WORKSPACES_FULL_URLS } from '~libs/routes/highlight-extension';
import { UpdateWorkspaceDto } from '~libs/dto/highlight-extension';
import { IUpdateWorkspaceRo } from '~libs/ro/highlight-extension';

import AccordionForm from '~/highlight-extension-fe/common/ui/forms/accordion-form';
import SortableFields from '~/highlight-extension-fe/common/ui/fields/sortable-fields/sortable-fields';
import ColorField from '~/highlight-extension-fe/common/ui/fields/color-field';
import ApiServise from '~/highlight-extension-fe/common/services/api.service';
import { HTTPError } from '~/highlight-extension-fe/errors/http-error/http-error';
import IColor from '~/highlight-extension-fe/common/constants/default-values/types/color.interface';
import httpErrHandler from '~/highlight-extension-fe/errors/http-error/http-err-handler';

import IChangeColorsForm from '../types/change-colors-form.interface';

export interface IChangeColorsFormProps {
	currentColors: IColor[];
	onSuccess: (colors: IColor[]) => void;
}

export default function ChangeColorsForm({
	currentColors,
	onSuccess,
}: IChangeColorsFormProps): JSX.Element {
	const toast = useToast({
		duration: 4000,
		isClosable: true,
		status: 'error',
		position: 'top',
	});
	const useFormReturnValue = useForm<IChangeColorsForm>({
		values: {
			colors: currentColors,
		},
	});
	const { register, control, setError } = useFormReturnValue;
	const useFieldArrayReturn = useFieldArray({
		control,
		name: 'colors',
	});
	const { fields } = useFieldArrayReturn;

	async function onSubmit(formValues: IChangeColorsForm): Promise<boolean> {
		const newColors = formValues.colors.map(({ color }) => color);
		const resp = await new ApiServise().patch<UpdateWorkspaceDto, IUpdateWorkspaceRo>(
			// TODO
			WORKSPACES_FULL_URLS.update(-1),
			{
				colors: newColors,
			}
		);
		if (resp instanceof HTTPError) {
			handleErr(resp);
			return false;
		}
		toast({
			title: 'Colors has been successfully saved',
			status: 'success',
		});
		onSuccess(resp.colors.map((color) => ({ color })));
		return true;
	}

	function handleErr(err: HTTPError): void {
		httpErrHandler({
			err,
			onValidationErr(property, errors) {
				setError(property as keyof IChangeColorsForm, {
					message: errors.join(),
				});
			},
			onErrWithMsg(msg) {
				toast({
					title: 'Failed to change colors',
					description: msg,
				});
			},
			onUnhandledErr() {
				toast({
					title: 'Failed to change colors',
					description: 'Something went wrong. Please try again',
				});
			},
		});
	}

	const accordionButtonText = (
		<div className="options_colors">
			{currentColors.map(({ color }, index) => (
				<div
					key={index}
					className="options_colorsItem"
					style={{
						backgroundColor: color,
					}}
				></div>
			))}
		</div>
	);

	return (
		<AccordionForm
			useFormReturnValue={useFormReturnValue}
			onSubmitHandler={onSubmit}
			accordionButtonText={accordionButtonText}
			tooltipLabel="Edit"
			labelText="Highlighter colors"
		>
			<SortableFields
				useFieldArrayReturn={useFieldArrayReturn}
				addBtn={{
					text: '+ Add color',
					value: {
						color: '#718096',
					},
				}}
				showDeleteBtn={true}
				fieldsList={fields.map((field, index) => (
					<ColorField
						key={field.id}
						register={register}
						name={`colors.${index}.color`}
						formControlCl="options_colorFormControl"
						inputCl="options_colorInput"
					/>
				))}
			/>
		</AccordionForm>
	);
}
