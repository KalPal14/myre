import React from 'react';

import { ISVGProps } from './types/svg-props';

export function ExclamationOctagonSVG({
	width = 18,
	height = 18,
	fill = 'none',
	color = '#ffdd00',
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
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0 11.25L4.75 16H11.25L16 11.25V4.75L11.25 0H4.75L0 4.75V11.25ZM7 3V9H9V3H7ZM7 11V13H9V11H7Z"
				fill={color}
			/>
		</svg>
	);
}
