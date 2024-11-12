import React from 'react';

import { ISVGProps } from './types/svg-props';

export function GripVerticalSVG({
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
				d="M3 4V0H7V4L3 4Z"
				fill={color}
			/>
			<path
				d="M3 6V10H7L7 6H3Z"
				fill={color}
			/>
			<path
				d="M9 6V10H13V6H9Z"
				fill={color}
			/>
			<path
				d="M9 0V4L13 4V0H9Z"
				fill={color}
			/>
			<path
				d="M3 16V12H7V16H3Z"
				fill={color}
			/>
			<path
				d="M9 12V16H13V12H9Z"
				fill={color}
			/>
		</svg>
	);
}
