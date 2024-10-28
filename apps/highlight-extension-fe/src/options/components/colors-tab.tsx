import React from 'react';

import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';

import { DEF_COLORS } from '~/highlight-extension-fe/common/constants/default-values/colors';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';

import ChangeColorsForm from './change-colors-form';

export default function ColorsTab(): JSX.Element {
	const [currentWorkspace, setCurrentWorkspace] = useCrossExtState<IBaseWorkspaceRo>(
		'currentWorkspace',
		// TODO: тут нужен null
		{ id: 1, name: 'W 1', ownerId: 1, colors: [] }
	);

	// TODO: разобраться зачем я вообще использую IColors[]
	// скорее всего это связано с формой, но возможно для простоты можно это убрать
	const colorsFormFormat = currentWorkspace?.colors.map((color) => ({ color }));

	return (
		<section className="options_colorsTab">
			{currentWorkspace && (
				<ChangeColorsForm
					currentColors={colorsFormFormat?.length ? colorsFormFormat : DEF_COLORS}
					onSuccess={(colors) =>
						setCurrentWorkspace({
							...currentWorkspace,
							colors: colors.map(({ color }) => color),
						})
					}
				/>
			)}
		</section>
	);
}
