import * as PIXI from 'pixi.js';

import Movemint from '../Movemint';

export default class Sprite extends PIXI.Sprite {
	dragging: boolean;
	hover: boolean;
	offSet: PIXI.Point;
	movemint: Movemint;
	graphics: PIXI.Graphics;
	renderedBounds: boolean;
	constructor(texture: PIXI.Texture, movemint: Movemint) {
		super(texture);
		this.movemint = movemint;
		this.anchor.set(0.5);
		this.interactive = true;
		this.dragging = false;
		this.hover = false;
		this.offSet = new PIXI.Point(0, 0);
		this.graphics = new PIXI.Graphics();
		this.renderedBounds = false;
		this.graphics.visible = false;
		this.on('mouseover', this.onHoverEnter);
		this.on('mouseout', this.onHoverLeave);
		this.on('mousedown', this.onDragStart);
		this.on('mouseup', this.onDragStop);
		this.on('mousemove', this.onDrag);
	}

	onHoverEnter(event) {
		this.hover = true;
		this.movemint.startSelection();
		this.update();
	}

	onHoverLeave(event) {
		this.hover = false;
		this.movemint.stopSelection();
		this.update();
	}

	onDragStart(event) {
		var localPosition = event.data.getLocalPosition(this.parent);
		this.offSet.set(this.x - localPosition.x, this.y - localPosition.y);
		this.dragging = true;
		this.update();
	}

	onDragStop(event) {
		this.dragging = false;
		this.offSet.set(0, 0);
		this.update();
	}

	onDrag(event) {
		if (this.dragging) {
			var newPosition = event.data.getLocalPosition(this.parent);
			this.position.x = newPosition.x + this.offSet.x;
			this.position.y = newPosition.y + this.offSet.y;
		}
	}

	drawBounds() {
		var bounds = this.getLocalBounds();
		this.graphics.lineStyle(1, 0x0000FF, 1);
		this.graphics.beginFill(0x000000, 0);
		this.graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
		this.graphics.endFill();
		this.addChild(this.graphics);
	}

	update() {
		if(!this.renderedBounds) {
			this.drawBounds();
			this.renderedBounds = true;
		}
		if (this.hover || this.dragging) {
			this.graphics.visible = true;
		} else {
			this.graphics.visible = false;
		}
	}


}
