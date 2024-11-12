import React from 'react';

import { ISVGProps } from './types/svg-props';

export function TrashSVG({
	width = 18,
	height = 18,
	fill = 'none',
	color = '#4a4a4a',
	cursor,
	onClick,
}: ISVGProps): JSX.Element {
	return (
		<svg
			className="svg"
			cursor={cursor}
			width={width}
			height={height}
			fill={fill}
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
			onClick={onClick}
		>
			<path
				d="M4 2H1V4H15V2H12V0H4V2Z"
				fill={color}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M3 6H13V16H3V6ZM7 9H9V13H7V9Z"
				fill={color}
			/>
		</svg>
	);
}
