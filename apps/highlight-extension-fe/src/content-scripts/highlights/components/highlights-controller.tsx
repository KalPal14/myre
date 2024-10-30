import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import ReactTextareaAutosize from 'react-textarea-autosize';
import cl from 'classnames';

import { IBaseWorkspaceRo } from '~libs/ro/highlight-extension';

import { DEF_COLORS } from '~/highlight-extension-fe/common/constants/default-values/colors';
import { FULL_OPTIONS_ROUTES } from '~/highlight-extension-fe/common/constants/routes/options';
import openTabDispatcher from '~/highlight-extension-fe/service-worker/handlers/open-tab/open-tab.dispatcher';
import useCrossExtState from '~/highlight-extension-fe/common/hooks/cross-ext-state.hook';
import setSidepanelDispatcher from '~/highlight-extension-fe/service-worker/handlers/set-sidepanel/open-sidepanel.dispatcher';
import getPageUrl from '~/highlight-extension-fe/common/helpers/get-page-url.helper';
import TrashSVG from '~/highlight-extension-fe/assets/imgs/svg/trash';
import ArrowRightToLineSVG from '~/highlight-extension-fe/assets/imgs/svg/arrow-right-to-line';
import AlignTextJustifySVG from '~/highlight-extension-fe/assets/imgs/svg/align-text-justify';
import CogSVG from '~/highlight-extension-fe/assets/imgs/svg/cog';

import IHighlightControllerDynamicStyles from '../types/highlight-controller-dynamic-styles.interface';

export interface IHighlightsControllerProps {
	clientX: number;
	pageY: number;
	note?: string;
	forExistingHighlight?: boolean;
	onSelectColor: (color: string, note?: string) => void;
	onControllerClose: (color: string, note?: string) => void;
	onDeleteClick?: () => void;
}

export default function HighlightsController({
	clientX,
	pageY,
	note,
	forExistingHighlight,
	onSelectColor,
	onControllerClose,
	onDeleteClick = (): void => {},
}: IHighlightsControllerProps): JSX.Element {
	const firstColorRef = useRef(DEF_COLORS[0]);

	const { register, watch } = useForm<{ note?: string }>({
		values: {
			note,
		},
	});
	const [currentWorkspace] = useCrossExtState<IBaseWorkspaceRo | null>('currentWorkspace', null);

	const [showNoteField, setShowNoteField] = useState(Boolean(note));
	const [colors, setColors] = useState(DEF_COLORS);

	useEffect(() => {
		return (): void => onControllerClose(firstColorRef.current, watch('note'));
	}, []);

	useEffect(() => {
		if (currentWorkspace?.colors.length) {
			setColors(currentWorkspace.colors);
			firstColorRef.current = currentWorkspace.colors[0];
			return;
		}
		setColors(DEF_COLORS);
		firstColorRef.current = DEF_COLORS[0];
	}, [currentWorkspace?.colors]);

	useEffect(() => {
		setShowNoteField(Boolean(note));
	}, [note]);

	function getColorsInOneLineAmount(): number {
		if (showNoteField && colors.length < 5) {
			return 5;
		}
		if (colors.length > 8) {
			return 8;
		}
		return colors.length;
	}
	function calculateDynamicStyles(): IHighlightControllerDynamicStyles {
		const colorBlockWidth = 26;
		const restControllerWidth = 79;
		const rightIndent = 30;
		const maxColorsInLine = 8;

		const colorsInOneLine = getColorsInOneLineAmount();
		const controllerWidth = colorBlockWidth * colorsInOneLine + restControllerWidth;
		const toEndPageSpacing = window.innerWidth - clientX - controllerWidth - rightIndent;

		const noteBtnMlAbs = colors.length <= maxColorsInLine ? 20 : 46;
		const noteTextareaMl = colors.length <= maxColorsInLine ? 4 : 0;
		const left = toEndPageSpacing < 0 ? clientX - Math.abs(toEndPageSpacing) : clientX;

		return {
			left,
			controllerWidth,
			noteTextareaMl,
			noteBtnMlAbs,
		};
	}
	const ds = calculateDynamicStyles();

	return (
		<article className="highlighController">
			<section
				className={cl('highlighController_topPanel', {
					'highlighController_topPanel-externalLinkOnly': !forExistingHighlight,
				})}
				style={{
					top: pageY - 40,
					left: ds.left,
				}}
			>
				{forExistingHighlight && (
					<TrashSVG
						width={22}
						height={22}
						onClick={onDeleteClick}
					/>
				)}
				<ArrowRightToLineSVG
					width={22}
					height={22}
					onClick={(): void => setSidepanelDispatcher({ url: getPageUrl(), enabled: true })}
				/>
			</section>

			<section
				className="highlighController_mainPanel"
				style={{
					top: pageY,
					left: ds.left,
				}}
			>
				<div className="highlighController_mainPanelBtnsContainer">
					<div
						onClick={() => setShowNoteField(!showNoteField)}
						className="highlighController_noteBtn"
						style={{
							marginRight: `-${ds.noteBtnMlAbs}px`,
						}}
					>
						<AlignTextJustifySVG
							width={24}
							height={24}
							color="#fff"
						/>
					</div>
					<div
						className="highlighController_colorsAndSettingsContainer"
						style={{
							paddingLeft: `${ds.noteBtnMlAbs}px`,
						}}
					>
						<ul className="highlighController_colors">
							{colors.map((color, index) => (
								<li
									key={index}
									className="highlighController_color"
								>
									<div
										key={index}
										onClick={() => onSelectColor(color, watch('note'))}
										style={{
											backgroundColor: color,
										}}
									/>
								</li>
							))}
						</ul>

						<CogSVG
							width={26}
							height={26}
							onClick={() => openTabDispatcher({ url: FULL_OPTIONS_ROUTES.colors })}
						/>
					</div>
				</div>
				{showNoteField && (
					<ReactTextareaAutosize
						minRows={3}
						{...register('note')}
						placeholder="Note..."
						className="highlighController_noteTextarea"
						style={{
							width: `${ds.controllerWidth - 15}px`,
							marginLeft: `${ds.noteTextareaMl}px`,
						}}
						rows={5}
					/>
				)}
			</section>
		</article>
	);
}
