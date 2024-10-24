import React from 'react';

import { ISVGProps } from '~/highlight-extension-fe/common/types/svg-props';

export default function AlignTextJustifySVG({
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
				d="M15 1H1V3H15V1Z"
				fill={color}
			/>
			<path
				d="M1 5H15V7H1V5Z"
				fill={color}
			/>
			<path
				d="M15 9H1V11H15V9Z"
				fill={color}
			/>
			<path
				d="M11 13H1V15H11V13Z"
				fill={color}
			/>
		</svg>
	);
}
