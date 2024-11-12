import React from 'react';

import { ISVGProps } from './types/svg-props';

export function AngleUpSVG({
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
				d="M8.00003 7.82842L12.5858 12.4142L15.4142 9.58578L8.00003 2.17157L0.585815 9.58578L3.41424 12.4142L8.00003 7.82842Z"
				fill={color}
			/>
		</svg>
	);
}
