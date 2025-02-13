import { CrossChromeStateBuilder } from '~libs/react-core';

import { defaultCrossBrowserStateValues } from './constants/default-cross-browser-state-values';

const crossBrowserState = new CrossChromeStateBuilder(defaultCrossBrowserStateValues);

export default crossBrowserState.useCrossBrowserState.bind(crossBrowserState);
