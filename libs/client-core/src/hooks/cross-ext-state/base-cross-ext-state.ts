import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

export function baseCrossExtState<State extends Record<string, any>, K extends keyof State>(
	stateKey: K,
	defaultValue: State[K]
): [State[K], Dispatch<SetStateAction<State[K]>>] {
	const isNewSession = useRef(true);

	const [state, setState] = useState(defaultValue);

	useEffect(() => {
		setCrossExtState();
	}, [state, stateKey, defaultValue]);

	useEffect(() => {
		chrome.storage.onChanged.addListener(onStoreChangeHandler);

		return (): void => chrome.storage.onChanged.removeListener(onStoreChangeHandler);
	}, [stateKey, setState]);

	async function setCrossExtState(): Promise<void> {
		if (isNewSession.current) {
			await setStateForNewSession();
			return;
		}
		await chrome.storage.local.set({
			[stateKey]: state,
		});
	}

	async function setStateForNewSession(): Promise<void> {
		const currentState = await chrome.storage.local.get(stateKey.toString());
		const currentValue = currentState[stateKey.toString()];
		if (currentValue !== undefined) {
			setState(currentValue);
		} else {
			setState(defaultValue);
		}

		isNewSession.current = false;
	}

	function onStoreChangeHandler(newState: { [key: string]: chrome.storage.StorageChange }): void {
		const key = Object.keys(newState)[0];
		if (key === stateKey) {
			setState(newState[key].newValue);
		}
	}

	return [state, setState];
}
