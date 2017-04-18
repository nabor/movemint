import './Movemint.scss';

import * as React from 'react';

import Editor from './canvas/Editor';
import Bone from './canvas/Bone';
import Toolbar from './Toolbar';
import Sprite from './canvas/Sprite';

interface MovemintProps {
}

interface MovemintState {
}

export default class Movemint extends React.Component<MovemintProps, MovemintState> {
	canvas: HTMLCanvasElement;
	renderer: PIXI.WebGLRenderer;
	editor: Editor;
	scale: number;
	moving: boolean;
	selecting: boolean;
	start: any;
	boneId: number;
	creatingBone: boolean;
	rootBone: Bone;
	selectedBone: Bone;
	createdBone: Bone;
	hoverBone: Bone;
	boneTexture: PIXI.Texture;
	jointTexture: PIXI.Texture;
	constructor(props: MovemintProps, context: any) {
		super(props, context);
		this.moving = false;
		this.selecting = false;
		this.scale = 1;
		this.boneId = 1;
		this.creatingBone = false;
	}

	componentDidMount() {
		this.canvas = document.getElementById('movemint-app-editor-canvas') as HTMLCanvasElement;
		this.canvas.onwheel = this.onScroll;
		this.canvas.onmousedown = this.onDragStart;
		window.onmousemove = this.onDrag;
		window.onmouseup = this.onDragEnd;
		window.onresize = this.onResize;
		var width = this.canvas.offsetWidth;
		var height = this.canvas.offsetHeight;
		this.renderer = new PIXI.WebGLRenderer(width, height, {
			view: this.canvas,
			backgroundColor : 0x555555,
			antialias: false,
		});

		this.start = {
			editor: {x: width/2, y: height/2},
			mouse: {x: 0, y: 0}
		};
		this.boneTexture = PIXI.Texture.fromImage("assets/bone.png");
		this.jointTexture = PIXI.Texture.fromImage("assets/joint.png");
		this.editor = new Editor(this.start.editor.x, this.start.editor.y, width, height);
		this.rootBone = new Bone("Root Bone", this.start.editor.x, this.start.editor.y, this);
		this.rootBone.select();
		this.selectedBone = this.rootBone;
		this.hoverBone = this.rootBone;
		this.animate();
	}

	startSelection() {
		this.selecting = true;
	}

	stopSelection() {
		this.selecting = false;
	}

	onResize = (event) => {
		this.renderer.resize(this.canvas.offsetWidth, this.canvas.offsetHeight);
		this.editor.setCanvasSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
		setTimeout(() => {
			this.renderer.resize(this.canvas.offsetWidth, this.canvas.offsetHeight)
			this.editor.setCanvasSize(this.canvas.offsetWidth, this.canvas.offsetHeight);
		}, 50);
	}


	onScroll = (event) => {
		var originalScale = this.editor.getScale();
		this.scale = originalScale + event.wheelDelta / 1200;
		if (this.scale < 0.1) {
			this.scale = originalScale;
		}
		this.editor.setScale(this.scale);
		console.log(this.scale);
	}

	onDragStart = (event) => {
		console.log(event);
		console.log(event.button);
		if(!this.selecting) {
			if(event.button === 0) {
				this.creatingBone = true;
				var parent = this.rootBone;
				if(this.selectedBone) {
					parent = this.selectedBone;
				}
				this.createdBone = new Bone("Bone "+this.boneId, event.x, event.y, this);
			}
			if(event.button === 1) {
				this.start.editor.x = this.editor.world.x;
				this.start.editor.y = this.editor.world.y;
				this.start.mouse.x = event.x;
				this.start.mouse.y = event.y;
				this.moving = true;
			}
		}
	}

	onDrag = (event) => {
		if(this.creatingBone) {
			this.createdBone.setEnd(event.x, event.y);
			this.createdBone.update();
		}
		if (this.moving) {
			var x = this.start.editor.x + event.x - this.start.mouse.x;
			var y = this.start.editor.y + event.y - this.start.mouse.y;
			this.editor.moveTo(x, y);
		}
	};

	onDragEnd = (event) => {
		if (this.creatingBone) {
			this.createdBone.setEnd(event.x, event.y);
			this.createdBone.update();
			this.boneId++;
			this.creatingBone = false;
		}
		if (this.moving) {
			this.moving = false;
		}
		//drawList();
	};


	addImage = (imageData: string) => {
		var newSprite = new Sprite(
			PIXI.Texture.fromImage(imageData),
			this
		);
		this.editor.addSprite(newSprite);
	}

	animate = () => {
		requestAnimationFrame(this.animate);
		this.renderer.render(this.editor);
	}

	render() {
		return <div id="movemint-app">
			<div id="movemint-app-editor">
				<canvas id="movemint-app-editor-canvas"></canvas>
			</div>
			<Toolbar addImage={this.addImage}/>
		</div>;
	}
}
