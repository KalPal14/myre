import { BrowserFactory } from './browser.factory';

// import { browserFactory } from './browser.factory';

export const browserAdapter = new BrowserFactory().create();

// export const browserAdapter = browserFactory();
