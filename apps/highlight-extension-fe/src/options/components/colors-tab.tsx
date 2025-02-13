import React from 'react';

import { DEF_COLORS } from '~/highlight-extension-fe/common/constants/default-values/colors';
import useCrossBrowserState from '~/highlight-extension-fe/common/hooks/cross-browser-state/cross-browser-state.hook';

import ChangeColorsForm from './change-colors-form';

export default function ColorsTab(): JSX.Element {
	const [currentWorkspace, setCurrentWorkspace] = useCrossBrowserState('currentWorkspace');

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
