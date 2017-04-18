import * as PIXI from 'pixi.js';
import Sprite from './Sprite';

export default class Editor extends PIXI.Container {
	graphics: PIXI.Graphics;
	world: PIXI.Container;
	axis: PIXI.Container;
	images: Sprite[];
	canvasWidth: number;
	canvasHeight: number;
	constructor(x: number, y: number, width: number, height: number) {
		super();
		this.init();
		this.setCanvasSize(width, height);
		this.moveTo(x, y);
	}

	init() {
		this.images = new Array<Sprite>();
		this.world = new PIXI.Container();
		this.axis = new PIXI.Container();
		this.graphics = new PIXI.Graphics();
		this.axis.addChild(this.graphics);
		this.addChild(this.world);
		this.addChild(this.axis);
	}

	setCanvasSize(width: number, height: number) {
		this.canvasWidth = width;
		this.canvasHeight = height;
		this.drawAxis();
	}


	getScale(): number {
		return this.world.scale.x;
	}

	setScale(scale: number) {
		this.world.scale.set(scale, scale);
	}

	moveTo(x: number, y: number) {
		this.world.position.set(x, y);
		this.axis.position.set(x, y);
		this.drawAxis();
	}

	drawAxis() {
		this.graphics.clear();
		this.graphics.lineStyle(1, 0x000000, 0.4);
		if (this.axis.x <= this.canvasWidth && this.axis.x >= -this.canvasWidth) {
			this.graphics.moveTo(-this.axis.x - this.canvasWidth, 0);
			this.graphics.lineTo(-this.axis.x + this.canvasWidth, 0);
		}
		if (this.axis.y <= this.canvasHeight && this.axis.y >= -this.canvasHeight) {
			this.graphics.moveTo(0, -this.axis.y - this.canvasHeight);
			this.graphics.lineTo(0, -this.axis.y + this.canvasHeight);
		}
		this.graphics.endFill();
	}

	addSprite(sprite: Sprite) {
		this.world.addChild(sprite);
		this.images.push(sprite);
		this.images.push(sprite);
	}
}
