import React from 'react';
import { Button } from '@chakra-ui/react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { ArrayPath, FieldArray, FieldValues, UseFieldArrayReturn } from 'react-hook-form';

import '../fields.scss';

import TJsxContent from '~/highlight-extension-fe/common/types/jsx-content.type';

import SortableItem from './sortable-fields-item';

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
	const { move, append, remove } = useFieldArrayReturn;

	function handleDragEnd({ source, destination }: DropResult): void {
		if (destination && destination.index !== source.index) {
			move(source.index, destination.index);
			if (onSortEnd) {
				onSortEnd();
			}
		}
	}

	function addElement(): void {
		if (!addBtn) return;
		append(addBtn.value);
	}

	function removeElement(index: number): void {
		if (onDelete) {
			onDelete(index);
		}
		remove(index);
	}

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<Droppable droppableId="droppable">
				{(provided) => (
					<>
						<ul
							{...provided.droppableProps}
							ref={provided.innerRef}
							className="sortableFields"
						>
							{fieldsList.map((field, index) =>
								field ? (
									<Draggable
										key={index}
										draggableId={index.toString()}
										index={index}
									>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<SortableItem
													key={index}
													field={field}
													index={index}
													onDelete={removeElement}
													showDeleteBtn={showDeleteBtn}
												/>
											</div>
										)}
									</Draggable>
								) : null
							)}
						</ul>
						{provided.placeholder}
					</>
				)}
			</Droppable>
			{addBtn && (
				<div className="sortableFields_addBtnContainer">
					<Button
						onClick={addElement}
						colorScheme="teal"
						variant="ghost"
					>
						{addBtn.text}
					</Button>
				</div>
			)}
		</DragDropContext>
	);
}
