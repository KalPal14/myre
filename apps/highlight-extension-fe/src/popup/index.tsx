import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import Popup from './popup';

function init(): void {
	const rootContainer = document.createElement('div');
	document.body.appendChild(rootContainer);
	const root = createRoot(rootContainer);
	root.render(
		<ChakraProvider>
			<Popup />
		</ChakraProvider>
	);
}

init();
