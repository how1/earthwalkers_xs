import * as THREE from 'three';
import { bodies, camera, renderer, scene, init } from "./physics/Initialize.js";
import * as Physics from './physics/physics.js';
import 'normalize.css';
import './styles/styles.scss';
init();


const update = () => {
	Physics.updateCharacter();
};

const render = () => {
	renderer.render( scene, camera );
};

const GameLoop = () => {	
	requestAnimationFrame( GameLoop );
	update();
	render();
};

GameLoop();