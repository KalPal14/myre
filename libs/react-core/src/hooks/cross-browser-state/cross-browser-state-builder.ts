import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { isEqual } from 'lodash';

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
			const currentStorageValue = await browserAdapter.storage.local
				.get(stateKey.toString())
				.then((state) => state[stateKey.toString()]);

			if (isNewSession.current) {
				if (currentStorageValue !== undefined) {
					setState(currentStorageValue);
				}
				isNewSession.current = false;
				return;
			}

			if (isEqual(state, currentStorageValue)) return;
			await browserAdapter.storage.local.set({
				[stateKey]: state,
			});
		};

		const onStoreChangeHandler = (
			updatedValue: Record<string, { newValue?: any; oldValue?: any }>
		): void => {
			const [key, { newValue, oldValue }] = Object.entries(updatedValue)[0];
			if (key === stateKey && !isEqual(newValue, oldValue)) {
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
