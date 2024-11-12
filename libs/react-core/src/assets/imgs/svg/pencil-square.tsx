import React from 'react';

import { ISVGProps } from './types/svg-props';

export function PencilSquareSVG({
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
				d="M13 0L16 3L9 10H6V7L13 0Z"
				fill={color}
			/>
			<path
				d="M1 1V15H15V9H13V13H3V3H7V1H1Z"
				fill={color}
			/>
		</svg>
	);
}
