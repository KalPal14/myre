import React from 'react';
// import { DragHandleIcon, DeleteIcon } from '@chakra-ui/icons';
// import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { ArrayPath, FieldArray, FieldValues, UseFieldArrayReturn } from 'react-hook-form';
import { Button } from '@chakra-ui/react';

import './fields.scss';

import TJsxContent from '~/highlight-extension-fe/common/types/jsx-content.type';

export interface ISortableFieldsProps<Fields extends FieldValues> {
	useFieldArrayReturn: UseFieldArrayReturn<Fields>;
	fieldsList: (JSX.Element | null)[];
	addBtn?: {
		text: TJsxContent;
		value: FieldArray<Fields, ArrayPath<Fields>> | FieldArray<Fields, ArrayPath<Fields>>[];
	};
	showDeleteBtn?: boolean;
	onDelete?: (index: number) => void;
	onSortEnd?: () => void;
}

export default function SortableFields<Fields extends FieldValues>({
	useFieldArrayReturn,
	fieldsList,
	addBtn,
	showDeleteBtn,
	onDelete,
	onSortEnd,
}: ISortableFieldsProps<Fields>): JSX.Element {
	// const { move, append, remove } = useFieldArrayReturn;

	// function sortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void {
	// 	move(oldIndex, newIndex);
	// 	if (onSortEnd) {
	// 		onSortEnd();
	// 	}
	// }

	// function addElement(): void {
	// 	if (!addBtn) return;
	// 	append(addBtn.value);
	// }

	// function removeElement(index: number): void {
	// 	if (onDelete) {
	// 		onDelete(index);
	// 	}
	// 	remove(index);
	// }

	// function renderSortableElement(fields: JSX.Element, index: number): JSX.Element {
	// 	const Handler = SortableHandle(() => (
	// 		<DragHandleIcon
	// 			className="sortableFields_iconBtn"
	// 			cursor="grab"
	// 			color="gray.600"
	// 		/>
	// 	));
	// 	const Element = SortableElement(() => (
	// 		<li className="sortableFields_item">
	// 			<div className="sortableFields_itemLeftBox">
	// 				<Handler />
	// 				<div className="sortableFields_customContentBox">{fields}</div>
	// 			</div>
	// 			<div className="sortableFields_itemRightBox">
	// 				{showDeleteBtn && (
	// 					<DeleteIcon
	// 						onClick={() => removeElement(index)}
	// 						className="sortableFields_iconBtn"
	// 						color="gray.600"
	// 					/>
	// 				)}
	// 			</div>
	// 		</li>
	// 	));
	// 	return (
	// 		<Element
	// 			key={fields.key}
	// 			index={index}
	// 		/>
	// 	);
	// }

	// function renderSortableContainer(fieldsList: (JSX.Element | null)[]): JSX.Element {
	// 	const Container = SortableContainer(() => (
	// 		<>
	// 			<ul className="sortableFields">
	// 				{fieldsList.map((field, index) => {
	// 					if (field === null) {
	// 						return null;
	// 					}
	// 					return renderSortableElement(field, index);
	// 				})}
	// 			</ul>
	// 			{addBtn && (
	// 				<div className="sortableFields_addBtnContainer">
	// 					<Button
	// 						onClick={addElement}
	// 						colorScheme="teal"
	// 						variant="ghost"
	// 					>
	// 						{addBtn.text}
	// 					</Button>
	// 				</div>
	// 			)}
	// 		</>
	// 	));
	// 	return (
	// 		<Container
	// 			onSortEnd={sortEnd}
	// 			useDragHandle={true}
	// 		/>
	// 	);
	// }

	return <Button>Btn</Button>;
}
