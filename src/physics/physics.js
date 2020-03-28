import * as THREE from 'three';
import * as Initialize from './Initialize.js';
import * as CollisionDetection from './CollisionDetection.js';

let character;
let collisions = [];
let yVelocity = 0;
let xVelocity = 0;
let gravity = 0.05;
const GRAVITATION = 0.05;
let xAcceleration = 1.08;
let yAcceleration = 1.1;
let xDeceleration = .9;
let xMaxSpeed = 1;
let yMaxSpeed = 1;
let jumping = false;
let jumpFrame = false;
let zeroTol = 0.01;
let elevation = 0;
let maxJumpHeight = 50;
let jumpSpeed = 1.5;
let hanging = false;

export const updateCharacter = () => {
    character = Initialize.character;
    if (Math.abs(xVelocity) < zeroTol) xVelocity = 0;
    getInput();
	collisions = CollisionDetection.getCollisions(Initialize.walls, Initialize.character);
    let gravityThisTurn = gravity;
    for (var i = 0; i < collisions.length; i++) {
        if (collisions[i] == 'top') {
            if (!jumpFrame){
                hanging = false;
                jumping = false;
                gravityThisTurn = 0;
                yVelocity = 0;
            }
        } else if (collisions[i] == 'left'){
            if (!jumpFrame){
                if (xVelocity > 0) xVelocity = 0;
            }
            if (keyEvents[0] == 'right'){
                hang();
            }
        } else if (collisions[i] == 'right'){
            if (!jumpFrame){
                if (xVelocity < 0) xVelocity = 0;
            }
            if (keyEvents[0] == 'left'){
                hang();
            }
        }
    }
    yVelocity -= gravityThisTurn;
    character.position.y += yVelocity;
    character.position.x += xVelocity;
    Initialize.camera.position.x = character.position.x;
    if (jumpFrame) jumpFrame = false;
}

const getInput = () => {
    if (keyEvents.length == 0) {
        if (!jumping){
            if (Math.abs(xVelocity) > 0)
                skid();
        }
    }
    if (keyEvents[0] == 'left') {
        goLeft();
    } else if (keyEvents[0] == 'right'){
        goRight();
    } else if (keyEvents[0] == 'up'){
        jump();
    }
    if ((!keyEvents.includes('up') && jumping) || character.position.y > elevation + maxJumpHeight){
        gravity = GRAVITATION;
    }
}

const goLeft = () => {
    if (xVelocity > 0) skid();
    else {
        if (xVelocity == 0) xVelocity = -0.3;
        if (xVelocity < 0){
            if (Math.abs(xVelocity) < xMaxSpeed) {
                // if (!jumping)
                    xVelocity *= xAcceleration;
            }
        }
    }
}

const goRight = () => {
    if (xVelocity < 0) skid();
    else {
        if (xVelocity == 0) xVelocity = 0.3;
        else if (xVelocity > 0){
            if (Math.abs(xVelocity) < xMaxSpeed) {
                // if (!jumping)
                    xVelocity *= xAcceleration;
            }
        }
    }
}

const jump = () => {
    if (!jumping){
        if (hanging) {
            console.log('hanging');
            hanging = false;
            if (keyEvents[1] == 'left'){
                xVelocity = .3;
            } else if (keyEvents[1] == 'right'){
                console.log('jump left');
                xVelocity = -.3;
            }
            yVelocity = jumpSpeed;
            jumping = true;
            jumpFrame = true;
            gravity = 0;
            elevation = character.position.y;
        } else if (yVelocity == 0 && !jumping){
            yVelocity = jumpSpeed;
            jumping = true;
            jumpFrame = true;
            gravity = 0;
            elevation = character.position.y;
        }
    }
}

const hang = () => {
    hanging = true;
    jumping = false;
    if (yVelocity < 0){
        yVelocity = -.2;
    }
}

const skid = () => {
    if (keyEvents.length == 0){
        xVelocity *= 0.95;
    } else {
        xVelocity *= 0.9;
    }
    // shortSkid
    // longSkid
}


let keyEvents = [];
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
	let keyCode = event.which;
	//37 Left | 38 Up | 39 Right | 40 Down
    if (keyCode == 37) {
        addKey('left');
    } else if (keyCode == 39){
        addKey('right')
    } else if (keyCode == 38 || keyCode == 90) {
        addKey('up');
    }
}

document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
	let keyCode = event.which;
	// //37 Left 38 Up 39 R 40 Down
    if (keyCode == 37) {
        removeKey('left');
    } else if (keyCode == 39){
        removeKey('right');
    } else if (keyCode == 38 || keyCode == 90) {
        removeKey('up');
    }

}

const removeKey = (key) => {
    for (var i = 0; i < keyEvents.length; i++) {
        if (keyEvents[i] == key) {
            keyEvents.splice(i, 1);
        }
    }
}

const addKey = (key) => {
    for (var i = 0; i < keyEvents.length; i++) {
        if (keyEvents[i] == key) {
            keyEvents.splice(i, 1);
        }
    }
    keyEvents.unshift(key);
}


