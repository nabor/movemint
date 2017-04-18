import * as PIXI from 'pixi.js';
import * as React from 'react';
import Movemint from '../Movemint';

export default class Bone extends PIXI.Sprite {
	movemint: Movemint;
	start: PIXI.Point;
	end: PIXI.Point;
	color: number;
	currentColor: number;
	globalPosition: PIXI.Point;
	dist: number;
	constructor(name: string, x: number, y: number, movemint: Movemint) {
		super(movemint.jointTexture);
		this.movemint = movemint;
		console.log(`Global: (${x}, ${y})`);
		this.name = name;
		if (this.movemint.selectedBone) {
			this.parent = this.movemint.selectedBone;
		} else {
			this.parent = this.movemint.editor.world;
		}
		console.log()
		this.start = this.parent.toLocal(new PIXI.Point(x, y));
		this.end = this.parent.toLocal(new PIXI.Point(x, y));
		this.color = 0x00FF00;
		this.currentColor = this.color;
		this.interactive = true;
		this.globalPosition = new PIXI.Point(x, y);
		this.dist = 0;
		this.update();
		this.parent.addChild(this);
		console.log(`Bone: (${this.x}, ${this.y})`);
	}
	update() {
		this.dist = Math.sqrt(Math.pow(this.end.x-this.start.x, 2) + Math.pow(this.end.y-this.start.y, 2));
		if (this.dist > 10) {
			this.texture = this.movemint.boneTexture;
			this.anchor.set(0, 0.5);
			this.scale.set(this.dist/512.0, this.dist/512.0);
		} else {
			this.texture = this.movemint.jointTexture;
			this.anchor.set(0.5, 0.5);
			this.scale.set(0.5, 0.5);
		}
		if( this.dist === 0 ) {
			this.rotation = 0;
		} else {
			if(this.start.y < this.end.y)
				this.rotation = Math.acos((this.end.x-this.start.x)/this.dist);
			else
				this.rotation = -Math.acos((this.end.x-this.start.x)/this.dist);
		}
		this.tint = this.currentColor;

		if(this.parent) {
			this.position = this.parent.toLocal(this.globalPosition);
		} else {
			this.position = this.globalPosition;
		}
	}

	setEnd(x, y) {
		this.end = this.parent.toLocal(new PIXI.Point(x, y));
	}

	mouseover(event) {
		event.stopPropagation();
		if(!this.movemint.creatingBone) {
			if(this.movemint.hoverBone) {
				this.movemint.hoverBone.tint = this.movemint.hoverBone.currentColor;
			}
			this.movemint.hoverBone = this;
			this.tint = 0xFFFFFF
			this.movemint.selecting = true;
		}
	}

	mouseout(event) {
		event.stopPropagation();
		this.tint = this.currentColor;
		this.movemint.selecting = false;
	}

	mouseup(event) {
		event.stopPropagation();
		if(!this.movemint.creatingBone) {
			if(this.movemint.selectedBone) {
				this.movemint.selectedBone.currentColor = this.movemint.selectedBone.color;
				this.movemint.selectedBone.tint = this.movemint.selectedBone.color;
			}
			this.select();
		}
	}

	select() {
		this.movemint.selectedBone = this;
			this.currentColor = 0x00FFFF;
			this.tint = this.currentColor;
	}

	/*
	getListHTML() {
		var html = '<li>';
		if(this === this.movemint.selectedBone) {
			html += '<span class="selected">'+this.name+'</span>';
		} else {
			html += this.name;
		}
		if (this.children.length > 0) html += '<ul>';
		for(var i=0; i < this.children.length; i++) {
			html += this.children[i].getListHTML();
		}
		if (this.children.length > 0) html += '</ul>';
		html += '</li>';
		return html
	}
	*/
	getChildAt(i: number) {
		return this.children[i] as Bone;
	}

	getJSX(): JSX.Element {
		var childs: JSX.Element[] = [];
		var name = (
			<span>{this.name}</span>
		);
		if (this === this.movemint.selectedBone) {
			name = (
				<span className="selected">{this.name}</span>
			);
		}
		for(var i=0; i < this.children.length; i++) {
			childs.push((this.children[i] as Bone).getJSX());
		}
		return (
			<li>
				{name}
				<ul>{childs}</ul>
			</li>
		);
	}
}
