import React from 'react';
import cl from 'classnames';

import styles from './toasts.shadow-dom.scss';

export interface IToastProps {
	status?: 'success' | 'error' | 'warning' | 'info';
	title?: JSX.Element | string;
	description?: JSX.Element | string;
}

export function Toast({ status = 'error', title, description }: IToastProps): JSX.Element {
	return (
		<>
			<style>{String(styles)}</style>
			<article
				className={cl('csToast', {
					'csToast-success': status === 'success',
					'csToast-error': status === 'error',
					'csToast-warning': status === 'warning',
					'csToast-info': status === 'info',
				})}
			>
				<div className="csToast_textContainer">
					{title ? <h6>{title}</h6> : <span>{description}</span>}
					{title && <span>{description}</span>}
				</div>
			</article>
		</>
	);
}
