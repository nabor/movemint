import './Toolbar.scss';

import {remote} from 'electron';
const dialog = remote.dialog;
import {readFile} from 'fs';
import * as React from 'react';

import Editor from './canvas/Editor';

interface ToolbarProps {
	addImage: (imageData: string) => void,
}

interface ToolbarState {
}

export default class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
	constructor(props: ToolbarProps, context: any) {
		super(props, context);
	}

	handleImage = (err: any, data: Buffer) => {
		var image = data.toString('base64');
		image = 'data:image/jpeg;base64,'+image;
		this.props.addImage(image);
	}

	openDialog = () => {
		var files = dialog.showOpenDialog({
			title: 'Select File',
			filters: [{name: 'Images', extensions: ['jpg', 'png', 'gif']}]
		});
		for (var file of files) {
			readFile(file, this.handleImage);
		}
	}

	render() {
		return <div id="movemint-app-toolbar">
			<button onClick={this.openDialog}>Open File</button>
		</div>;
	}
}
