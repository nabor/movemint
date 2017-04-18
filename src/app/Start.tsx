//import './Start.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {remote} from 'electron';
const app = remote.app;

import Movemint from './Movemint';

var movemintWindow: HTMLElement = document.createElement('div');
movemintWindow.setAttribute("id", "movemint");
document.body.appendChild(movemintWindow);
ReactDOM.render(
	<Movemint />,
	movemintWindow
);

// Disables drop of files
document.addEventListener('drop', (event) => {
	event.preventDefault();
	event.stopPropagation();
});
document.addEventListener('dragover', (event) => {
	event.preventDefault();
	event.stopPropagation();
});
