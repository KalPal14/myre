import React from 'react';

import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';

import { DEF_COLORS } from '~/highlight-extension-fe/common/constants/default-values/colors';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';

import ChangeColorsForm from './change-colors-form';

export default function ColorsTab(): JSX.Element {
	const [currentWorkspace, setCurrentWorkspace] = useCrossExtState<IBaseWorkspaceRo | null>(
		'currentWorkspace',
		null
	);

	return (
		<section className="options_colorsTab">
			{currentWorkspace && (
				<ChangeColorsForm
					currentColors={currentWorkspace.colors.length ? currentWorkspace.colors : DEF_COLORS}
					onSuccess={(colors) =>
						setCurrentWorkspace({
							...currentWorkspace,
							colors,
						})
					}
				/>
			)}
		</section>
	);
}
