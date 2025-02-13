import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { IBrowserStorage } from './types/browser-storage.interface';

export abstract class CrossBrowserStateBuilder<State extends Record<string, any>> {
	protected abstract storage: IBrowserStorage;

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
			await this.storage.set({
				[stateKey]: state,
			});
		};
		const setStateForNewSession = async (): Promise<void> => {
			const currentState = await this.storage.get(stateKey.toString());
			const currentValue = currentState[stateKey.toString()];
			if (currentValue !== undefined) {
				setState(currentValue);
			} else {
				setState(defaultValue);
			}

			isNewSession.current = false;
		};
		const onStoreChangeHandler = (key: string, newValue: any): void => {
			if (key === stateKey) {
				setState(newValue);
			}
		};

		useEffect(() => {
			setCrossExtState();
		}, [state, stateKey, defaultValue]);

		useEffect(() => {
			this.storage.onChanged.addListener(onStoreChangeHandler);

			return (): void => this.storage.onChanged.removeListener(onStoreChangeHandler);
		}, [stateKey, setState]);

		return [state, setState];
	}
}
