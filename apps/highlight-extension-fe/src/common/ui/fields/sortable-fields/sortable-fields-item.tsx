import React from 'react';

import GripVerticalSVG from '~/highlight-extension-fe/assets/imgs/svg/grip-vertical';
import TrashSVG from '~/highlight-extension-fe/assets/imgs/svg/trash';

export interface ISortableItemProps {
	field: JSX.Element;
	index: number;
	showDeleteBtn?: boolean;
	onDelete?: (index: number) => void;
}

export default function SortableItem({
	field,
	index,
	onDelete,
	showDeleteBtn,
}: ISortableItemProps): JSX.Element {
	return (
		<li className="sortableFields_item">
			<div className="sortableFields_itemLeftBox">
				<div>
					<GripVerticalSVG cursor="grab" />
				</div>
				<div className="sortableFields_customContentBox">{field}</div>
			</div>
			{showDeleteBtn && (
				<div className="sortableFields_itemRightBox">
					<TrashSVG onClick={() => onDelete?.(index)} />
				</div>
			)}
		</li>
	);
}
