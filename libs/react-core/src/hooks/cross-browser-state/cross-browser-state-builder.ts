import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { browserAdapter } from '~libs/client-core';
export class CrossBrowserStateBuilder<State extends Record<string, any>> {
	constructor(private defaultValues: State) {}

	useCrossBrowserState<Key extends keyof State>(
		stateKey: Key,
		defaultValue: State[Key] = this.defaultValues[stateKey]
	): [State[Key], Dispatch<SetStateAction<State[Key]>>] {
		const isNewSession = useRef(true);

		const [state, setState] = useState(defaultValue);

		const setCrossExtState = async (): Promise<void> => {
			if (isNewSession.current) {
				await setStateForNewSession();
				return;
			}
			await browserAdapter.storage.local.set({
				[stateKey]: state,
			});
		};
		const setStateForNewSession = async (): Promise<void> => {
			const currentState = await browserAdapter.storage.local.get(stateKey.toString());
			const currentValue = currentState[stateKey.toString()];
			if (currentValue !== undefined) {
				setState(currentValue);
			} else {
				setState(defaultValue);
			}

			isNewSession.current = false;
		};
		const onStoreChangeHandler = (updatedValue: Record<string, { newValue?: any }>): void => {
			const [key, { newValue }] = Object.entries(updatedValue)[0];
			if (key === stateKey) {
				setState(newValue);
			}
		};

		useEffect(() => {
			setCrossExtState();
		}, [state, stateKey, defaultValue]);

		useEffect(() => {
			browserAdapter.storage.local.onChanged.addListener(onStoreChangeHandler);

			return (): void =>
				browserAdapter.storage.local.onChanged.removeListener(onStoreChangeHandler);
		}, [stateKey, setState]);

		return [state, setState];
	}
}
