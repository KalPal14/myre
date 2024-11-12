import React from 'react';

import { GripVerticalSVG, TrashSVG } from '~libs/react-core';

export interface IDraggableItemProps {
	field: JSX.Element;
	index: number;
	showDeleteBtn?: boolean;
	onDelete?: (index: number) => void;
}

export function DraggableItem({
	field,
	index,
	onDelete,
	showDeleteBtn,
}: IDraggableItemProps): JSX.Element {
	return (
		<li className="draggableFields_item">
			<div className="draggableFields_itemLeftBox">
				<div>
					<GripVerticalSVG cursor="grab" />
				</div>
				<div className="draggableFields_customContentBox">{field}</div>
			</div>
			{showDeleteBtn && (
				<div className="draggableFields_itemRightBox">
					<TrashSVG onClick={() => onDelete?.(index)} />
				</div>
			)}
		</li>
	);
}
