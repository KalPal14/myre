import React from 'react';
import { Button } from '@chakra-ui/react';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { ArrayPath, FieldArray, FieldValues, UseFieldArrayReturn } from 'react-hook-form';

import '../fields.scss';

import { DraggableItem } from './draggable-fields-item';

export interface IDraggableFieldsProps<Fields extends FieldValues> {
	useFieldArrayReturn: UseFieldArrayReturn<Fields>;
	fieldsList: (JSX.Element | null)[];
	addBtn?: {
		text: JSX.Element | string;
		value: FieldArray<Fields, ArrayPath<Fields>> | FieldArray<Fields, ArrayPath<Fields>>[];
	};
	showDeleteBtn?: boolean;
	onDelete?: (index: number) => void;
	onSortEnd?: () => void;
}

export function DraggableFields<Fields extends FieldValues>({
	useFieldArrayReturn,
	fieldsList,
	addBtn,
	showDeleteBtn,
	onDelete,
	onSortEnd,
}: IDraggableFieldsProps<Fields>): JSX.Element {
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
							className="draggableFields"
						>
							{fieldsList.map((field, index) =>
								field ? (
									<Draggable
										key={index}
										draggableId={index.toString()}
										index={index}
									>
										{(provided) => (
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
											>
												<DraggableItem
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
				<div className="draggableFields_addBtnContainer">
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
