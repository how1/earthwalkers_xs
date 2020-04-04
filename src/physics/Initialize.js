import * as THREE from 'three';
import * as App from'../app.js';
import {setThreeJSElements, setButtons, restyleHTML} from './gameStep.js';
import * as Loc from './locations.js';

export let scene = new THREE.Scene();
export let camera = new THREE.PerspectiveCamera(75, (window.innerWidth-4) / (window.innerHeight-4), 0.1, 10001);
export let renderer = new THREE.WebGLRenderer();
setThreeJSElements();


(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

let height = window.innerHeight-4;
let width = window.innerWidth-4;

renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );	

let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';

window.addEventListener('resize', () => {
	windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';
	height = window.innerHeight-4;
	width = window.innerWidth-4;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
	restyleHTML(windowOffset);
	App.restyleHTMLApp(windowOffset);
	Loc.restyleHTML(windowOffset);
});

camera.position.z = 1400;

export let background;
export let button;
export let gameoverButton;
export let restartButton;
export let startButton;
export let winButton;

export let bgTex;
let physicalTex;
let bordersTex;
let secondaryTex;
let blankTex;
export let maps = [];
let buttonTex;
let startTex;
let gameoverButtonTex;
let restartButtonTex;
let winButtonTex;

let bar = App.bar;
// const setGameState = 

export const setBackground = (tex) => {
	background = maps[tex];
}

export const init = () => {
 	let geom = new THREE.PlaneGeometry(4378, 2435,32);
 	let mat = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide});
 	let backgroundSquare = new THREE.Mesh(geom, mat);
	backgroundSquare.position.x;
	if (!background){
		background = getBackgroundMesh( bgTex , 0, 0, geom, 1 );
	}
 	if (!button){
 		geom = new THREE.PlaneGeometry(500, 250, 32);
    	mat = new THREE.MeshBasicMaterial({map: buttonTex, side: THREE.DoubleSide});
 		button = new THREE.Mesh(geom, mat);
 		button.material.transparent = true;
 		button.material.opacity = .7;
 		button.position.y = window.innerHeight/2- 100;
    	button.position.x = 0;
    	button.position.z = 2;
 	}
 	if (!gameoverButton){
 		gameoverButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: gameoverButtonTex, side: THREE.FrontSide}));
 		gameoverButton.material.transparent = true;
 		gameoverButton.material.opacity = .7;
 		gameoverButton.position.y = window.innerHeight/2 - 100;
    	gameoverButton.position.x = 0;
    	gameoverButton.position.z = 2;
 	}
 	if (!restartButton){
 		restartButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: restartButtonTex, side: THREE.FrontSide}));
 		restartButton.material.transparent = true;
 		restartButton.material.opacity = .7;
 		restartButton.position.y = window.innerHeight/2 - 450;
    	restartButton.position.x = 0;
    	restartButton.position.z = 2;
 	}
 	if (!startButton){
 		startButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: startTex, side: THREE.FrontSide}));
 		startButton.material.transparent = true;
 		startButton.material.opacity = .7;
 		startButton.position.y = -950;
    	startButton.position.x = 1900;
    	startButton.position.z = 2;
 	}
 	 if (!winButton){
 		winButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: winButtonTex, side: THREE.FrontSide}));
 		winButton.material.transparent = false;
 		winButton.position.y = window.innerHeight/2 - 100;
    	winButton.position.x = 0;
    	winButton.position.z = 2;
 	}
	scene.add(background);
	// scene.add(backgroundSquare);
}

const getBackgroundMesh = (tex, zPos, yPos, geom, repeat) => {
	tex.wrapS = THREE.RepeatWrapping;
	tex.repeat.set( repeat , 1 );
	let mat = new THREE.MeshBasicMaterial({map: tex, side: THREE.FrontSide });
	mat.map.minFilter = THREE.LinearFilter
	mat.transparent = true;
	mat.opacity = 1;
	// let bgGeom = new THREE.PlaneGeometry(192* 10, 108, 32);
	let mesh = new THREE.Mesh(geom, mat);
	mesh.position.z = zPos;
	mesh.position.y = yPos;
	mesh.position.x;
	// scene.add(mesh);
	return mesh;
}

const getTexture = (path, func) => {
	let tex = new THREE.TextureLoader().load(path.toString());
	tex.generateMipmaps = false;
	return tex;
}

let listener;
let smallCheerFile = require("../sfx/smallCheer.mp3");
let mediumCheerFile = require("../sfx/mediumCheer.mp3");
let xtraBigCheerFile = require("../sfx/xtraBigCheer.mp3");
let musicFile = require("../sfx/lofi.mp3");
let clickFile = require("../sfx/click.mp3");

export let smallCheer;
export let mediumCheer;
export let bigCheer;
export let music;
export let click;

export const load = () => {

	buttonTex = getTexture(require('../pics/button.png'));
	gameoverButtonTex = getTexture(require('../pics/gameover.png'));
	restartButtonTex = getTexture(require('../pics/restart.png'));
	startTex = getTexture(require('../pics/start.png'));
	winButtonTex = getTexture(require('../pics/win.png'));
	buttonTex.generateMipmaps = true;
	gameoverButtonTex.generateMipmaps = true;
	restartButtonTex.generateMipmaps = true;
	startTex.generateMipmaps= true;
	winButtonTex.generateMipmaps = true;
	bordersTex = getTexture(require('../pics/with_borders.png'));
	blankTex = getTexture(require('../pics/World_map_blank_without_borders.png'));
	physicalTex = getTexture(require('../pics/physical.png'));
	secondaryTex = getTexture(require('../pics/secondary.png'));
	let geom = new THREE.PlaneGeometry(4378, 2435,32);
	maps.push(getBackgroundMesh(secondaryTex , 0, 0, geom, 1));
	maps.push(getBackgroundMesh(bordersTex , 0, 0, geom, 1));
	maps.push(getBackgroundMesh(physicalTex , 0, 0, geom, 1));
	maps.push(getBackgroundMesh(blankTex , 0, 0, geom, 1));
	bgTex = new THREE.TextureLoader().load(require('../pics/secondary.png'), function () {
		console.log("done");
		// init();
	});
	listener = new THREE.AudioListener();
    camera.add( listener );
	smallCheer = new THREE.Audio(listener);
    let smallCheerLoader = new THREE.AudioLoader();
    smallCheerLoader.load(smallCheerFile, 
        function(buffer){
            smallCheer.setBuffer( buffer );
            smallCheer.setLoop(false);
            smallCheer.setVolume(0.4);
        }, function ( xhr ) {
      
    });
    mediumCheer = new THREE.Audio(listener);
    let medCheerLoader = new THREE.AudioLoader();
    medCheerLoader.load(mediumCheerFile, 
        function(buffer){
            mediumCheer.setBuffer( buffer );
            mediumCheer.setLoop(false);
            mediumCheer.setVolume(0.4);
        }, function ( xhr ) {
      
    });
    bigCheer = new THREE.Audio(listener);
    let bigCheerLoader = new THREE.AudioLoader();
    bigCheerLoader.load(xtraBigCheerFile, 
        function(buffer){
            bigCheer.setBuffer( buffer );
            bigCheer.setLoop(false);
            bigCheer.setVolume(0.4);
        }, function ( xhr ) {
      
    });
    click = new THREE.Audio(listener);
    let clickLoader = new THREE.AudioLoader();
    clickLoader.load(clickFile, 
        function(buffer){
            click.setBuffer( buffer );
            click.setLoop(false);
            click.setVolume(0.4);
            // setTimeout(init, 3000);
            // scene.add(startButton);
            setTimeout(App.resetTime, 2000);
            setTimeout(App.setLoading, 2000);
            setButtons();
        }, function ( xhr ) {
 
    });
    music = new THREE.Audio(listener);
    let musicLoader = new THREE.AudioLoader();
    musicLoader.load(musicFile, 
        function(buffer){
            music.setBuffer( buffer );
            music.setLoop(true);
            music.setVolume(0.5);
            music.play();
            init();
            setButtons();
        }, function ( xhr ) {
      		// console.log(xhr);
    });
}


