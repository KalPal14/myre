import React from 'react';

import { ISVGProps } from '~/highlight-extension-fe/common/types/svg-props';

export default function ArrowRightToLineSVG({
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
				d="M7 13V10H0L1.74846e-07 6L7 6L7 3L8 3L13 8L8 13H7Z"
				fill={color}
			/>
			<path
				d="M14 14V2L16 2V14H14Z"
				fill={color}
			/>
		</svg>
	);
}
