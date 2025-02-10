import React, { cloneElement } from 'react';
import {
	Accordion,
	AccordionItem,
	Tooltip,
	AccordionButton,
	AccordionPanel,
	Button,
	Box,
	useBoolean,
	FormLabel,
} from '@chakra-ui/react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

import './forms.scss';
import { AngleUpSVG, PencilSquareSVG } from '~libs/react-core';

interface IAccordionFormProps<Form extends FieldValues> {
	children: JSX.Element;
	accordionButtonText: JSX.Element | string;
	tooltipLabel?: string;
	labelText?: string;
	onSubmitHandler: (formValue: Form) => Promise<boolean | void>;
}

interface IChildrenTypeFields<Form extends FieldValues> extends IAccordionFormProps<Form> {
	childrenType?: 'fields';
	formControls: UseFormReturn<Form>;
}

interface IChildrenTypeForm<Form extends FieldValues> extends IAccordionFormProps<Form> {
	childrenType: 'form';
	formControls?: undefined;
}

export function AccordionForm<Form extends FieldValues>(
	props: IChildrenTypeFields<Form>
): JSX.Element;
export function AccordionForm<Form extends FieldValues>(
	props: IChildrenTypeForm<Form>
): JSX.Element;

export function AccordionForm<Form extends FieldValues>({
	childrenType,
	formControls,
	children,
	accordionButtonText,
	tooltipLabel,
	labelText,
	onSubmitHandler,
}: IChildrenTypeFields<Form> | IChildrenTypeForm<Form>): JSX.Element {
	const [editMode, setEditMode] = useBoolean(false);

	const {
		reset,
		handleSubmit,
		formState: { isSubmitting },
	} = childrenType !== 'form' ? formControls : { formState: {} };

	async function onSubmit(formValue: Form): Promise<void> {
		const isSuccess = await onSubmitHandler(formValue);
		if (isSuccess) {
			reset?.();
			setEditMode.off();
		}
	}

	return (
		<Accordion
			pb={5}
			className="accordionForm"
			index={editMode ? 0 : -1}
		>
			<FormLabel
				mb={1}
				fontWeight={600}
			>
				{labelText}
			</FormLabel>
			<AccordionItem className="accordionForm_item">
				{({ isExpanded }) => (
					<>
						<Tooltip
							label={!isExpanded && tooltipLabel}
							fontSize="md"
							placement="top-end"
						>
							<AccordionButton onClick={setEditMode.toggle}>
								<Box
									as="span"
									flex="1"
									textAlign="left"
								>
									{accordionButtonText}
								</Box>
								{isExpanded ? <AngleUpSVG /> : <PencilSquareSVG />}
							</AccordionButton>
						</Tooltip>
						<AccordionPanel pb={4}>
							{childrenType === 'form' ? (
								<>
									{cloneElement(children, {
										onSuccess: async (data: Form) => onSubmit(data),
									})}
								</>
							) : (
								<form onSubmit={handleSubmit && handleSubmit(onSubmit)}>
									{children}
									<div>
										<Button
											mt={2}
											colorScheme="teal"
											isLoading={isSubmitting}
											type="submit"
										>
											Save
										</Button>
										<Button
											mt={2}
											ml={2}
											onClick={() => {
												reset?.();
												setEditMode.off();
											}}
											colorScheme="gray"
										>
											Cancel
										</Button>
									</div>
								</form>
							)}
						</AccordionPanel>
					</>
				)}
			</AccordionItem>
		</Accordion>
	);
}
