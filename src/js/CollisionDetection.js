import * as THREE from 'three';

export const getCollisions = (objects, character) => {
	let collisions = [];
	for (let i = 0; i < objects.length; i++) {
		let col = checkBoundingBoxes(objects[i], character);
		if (col != 'none'){
		collisions.push(col);
		}
	}
	return collisions;
}

export let checkBoundingBoxes = (a, b) => {
	let r1 = {
		x: a.position.x - a.geometry.parameters.width/2,
		y: a.position.y - a.geometry.parameters.height/2,
		w: a.geometry.parameters.width,
		h: a.geometry.parameters.height
	};
	let r2 = {
		x: b.position.x - b.geometry.parameters.width/2,
		y: b.position.y - b.geometry.parameters.height/2,
		w: b.geometry.parameters.width,
		h: b.geometry.parameters.height
	};

	let dx=(r1.x+r1.w/2)-(r2.x+r2.w/2);
    let dy=(r1.y+r1.h/2)-(r2.y+r2.h/2);
    let width=(r1.w+r2.w)/2;
    let height=(r1.h+r2.h)/2;
    let crossWidth=width*dy;
    let crossHeight=height*dx;
    let collision='none';
    //
    if(Math.abs(dx)<=width && Math.abs(dy)<=height){
        if(crossWidth>crossHeight){
           	if (crossWidth > (-crossHeight)){
           		collision = 'bottom';
           	} else {
           		collision = 'right';
           	}
       } else {
            if (crossWidth > (-crossHeight)){
            	collision = 'left';
            } else {
            	collision = 'top';
            }
        }
    }
    return collision;
}