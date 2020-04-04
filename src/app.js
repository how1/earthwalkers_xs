import * as THREE from 'three';
import { init, load, scene, renderer, camera} from "./physics/Initialize.js";
import {makeHTMLScoreboard, showScore, updateCircleRadius} from "./physics/gameStep.js";
import 'normalize.css';
import './styles/styles.scss';

let gameState = "during";
export const getGameState = () => {
	return gameState;
}

export const setGameState = (s) => {
	gameState = s;
}

load();
makeHTMLScoreboard();

// let renderer = Initialize.renderer;
// let scene = Initialize.scene;
// let camera = Initialize.camera;

// init();
let date = new Date();
let startTime = date.getTime();
export const resetTime = () => {
	startTime = new Date().getTime();
}

let currentTime = 0;
let totalTime = 15000;
export let bar;
let geom = new THREE.PlaneGeometry(500,100, 32);
geom.translate(250, 0, 0);
let mat = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.FrontSide});
bar = new THREE.Mesh(geom, mat);
bar.position.x = -window.innerWidth;
bar.position.y = window.innerHeight/2 - 300;
bar.position.z = 2;
// scene.add(bar);

let timerBar;
let timerBarBar;
let timeRemaining;

let currentAnTime = 0;
// let startAnTime;
// let totalAnTime = 1000;
// export const resetAnTime = () => {
// 	startAnTime = new Date().getTime();
// }

let loading = true;
export const setLoading = () => {
	loading = false;
}

export const restyleHTMLApp = (offset) => {
	timerBar.style.position = 'absolute';
	// levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	timerBar.style.width = 100;
	timerBar.style.height = 100;
	timerBar.style.backgroundColor = "red";
	timerBar.style.top = window.innerHeight / 2 + window.innerHeight/28 + 'px'; //+20
	timerBar.style.left = offset;//window.innerHeight/57.5 + 'px';
	timerBar.style.fontSize = window.innerHeight/40 + 'px';
	timerBarBar.style.position = 'absolute';
	// levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	timerBarBar.style.width = 125 + "px";
	timerBarBar.style.height = window.innerHeight/40 + "px";
	timerBarBar.style.backgroundColor = "#f00";
	timerBarBar.style.top = window.innerHeight / 2 + window.innerHeight/14 + 'px'; //+40
	timerBarBar.style.left = offset;//window.innerHeight/57.5 + 'px';
	timerBarBar.style.width = (window.innerHeight/4.25) * (timeRemaining/10) + "px";
}

const update = () => {
	//use html/css rectangle instaed of text
	//rect = div
	//rect.style.width
	//rect.style.height
	//rect.style.bgcolor
	if (!loading){
		let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';  
		// console.log(r, g);
		// bar.scale.set(timeRemaining, 1, 1);
	    if (!timerBar){
	        timerBar = document.createElement('div');
	        timerBar.style.position = 'absolute';
	        // levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	        timerBar.style.width = 100;
	        timerBar.style.height = 100;
	        timerBar.style.backgroundColor = "red";
	        timerBar.style.top = window.innerHeight / 2 + window.innerHeight/28 + 'px'; //+20
	        timerBar.style.left = windowOffset;//window.innerHeight/57.5 + 'px';
	        timerBar.style.fontSize = window.innerHeight/40 + 'px';
	        document.body.appendChild(timerBar);
	    }	    

	 	if (!timerBarBar){
	    	timerBarBar = document.createElement('div');
	        timerBarBar.style.position = 'absolute';
	        // levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	        timerBarBar.style.width = 125 + "px";
	        timerBarBar.style.height = window.innerHeight/40 + "px";
	        timerBarBar.style.backgroundColor = "#f00";
	        timerBarBar.style.top = window.innerHeight / 2 + window.innerHeight/14 + 'px'; //+40
	        timerBarBar.style.left = windowOffset;// window.innerHeight/57.5 + 'px';
	        document.body.appendChild(timerBarBar);
	    }
	    if (getGameState() == "during"){
	    	currentTime = new Date().getTime();
			// console.log(currentTime);
			timeRemaining = ((1 - (currentTime/(startTime+totalTime)))*1000000000);
			if (timeRemaining < 0) timeRemaining = 0;
			let timeRemainingDec = timeRemaining / 10;
			let timeRemainingInt = Math.round(timeRemaining) + 1;
			if (timeRemainingInt <= 0) timeRemainingInt = 1;
			let r = 0;
			let g = 255;
			if (timeRemainingDec > .5){
				r = 255 * ((1 - timeRemainingDec) * 2);
				g = 255;
			} else {
				r = 255;
				g = 255 * timeRemainingDec * 2;
			}
			r = Math.round(r);
			g = Math.round(g);
			if (timeRemaining <= 0) {
				showScore();
			}

	    	timerBarBar.style.backgroundColor = "rgb(" + r + "," + g + ",0)";
	    	timerBarBar.style.display = "inline-block";
	   		timerBarBar.style.width = (window.innerHeight/4.25) * (timeRemaining/10) + "px";
	   		timerBar.style.display = "inline-block";
	   		timerBar.innerHTML = "Time Remaining: " + timeRemaining.toFixed(1);
	    }
	// } else if (timerBar) timerBar.style.display = "none";
	// if (getGameState() == 'after'){
	// 	if (timerBarBar) timerBarBar.style.display = "none";
	}

	if (gameState == "animation"){
		updateCircleRadius();
	}
};

export const render = () => {
	renderer.render( scene, camera );
};

const GameLoop = () => {	
	requestAnimationFrame( GameLoop );
	update();
	render();
};

GameLoop();