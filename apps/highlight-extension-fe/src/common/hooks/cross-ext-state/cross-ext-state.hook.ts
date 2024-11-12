import { Dispatch, SetStateAction } from 'react';

import { baseCrossExtState } from '~libs/client-core';

import { DEFAULT_VALUES } from './default-values';
import { ICrossExtStateDescriptor } from './types/cross-ext-state-descriptor.interface';

export default function useCrossExtState<K extends keyof ICrossExtStateDescriptor>(
	stateKey: K,
	defaultValue: ICrossExtStateDescriptor[K] = DEFAULT_VALUES[stateKey]
): [ICrossExtStateDescriptor[K], Dispatch<SetStateAction<ICrossExtStateDescriptor[K]>>] {
	return baseCrossExtState<ICrossExtStateDescriptor, K>(stateKey, defaultValue);
}
