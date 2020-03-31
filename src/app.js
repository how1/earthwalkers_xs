import * as THREE from 'three';
import { bodies, camera, renderer, scene, init, load } from "./physics/Initialize.js";
import * as GAMESTEP from "./physics/gameStep.js";
import 'normalize.css';
import './styles/styles.scss';
load();
GAMESTEP.makeHTMLScoreboard();
// init();

const update = () => {
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