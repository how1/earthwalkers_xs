import * as THREE from 'three';

(function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//rawgit.com/mrdoob/stats.js/master/build/stats.min.js';document.head.appendChild(script);})()

let height = window.innerHeight-4;
let width = window.innerWidth-4;

export let scene = new THREE.Scene();
export let camera = new THREE.PerspectiveCamera(75, (window.innerWidth-4) / (window.innerHeight-4), 0.1, 10001);
export let renderer = new THREE.WebGLRenderer();

renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );	

window.addEventListener('resize', () => {
	height = window.innerHeight-4;
	width = window.innerWidth-4;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
});

camera.position.z = 1400;

export let background;
export let button;
export let gameoverButton;
export let restartButton;

export let bgTex;
let physicalTex;
let bordersTex;
let secondaryTex;
let blankTex;
export let maps = [];
let buttonTex;
let gameoverButtonTex;
let restartButtonTex;

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
 	geom = new THREE.PlaneGeometry(500, 250, 32);
    mat = new THREE.MeshBasicMaterial({map: buttonTex, side: THREE.DoubleSide});
 	if (!button){
 		button = new THREE.Mesh(geom, mat);
 		button.position.y = -950;
    	button.position.x = 1900;
    	button.position.z = 2;
 	}
 	if (!gameoverButton){
 		gameoverButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: gameoverButtonTex, side: THREE.FrontSide}));
 		gameoverButton.position.y = -950;
    	gameoverButton.position.x = 1900;
    	gameoverButton.position.z = 2;
 	}
 	if (!restartButton){
 		restartButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: restartButtonTex, side: THREE.FrontSide}));
 		restartButton.position.y = -600;
    	restartButton.position.x = 1900;
    	restartButton.position.z = 2;
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
let musicFile = require("../sfx/music.mp3");

export let smallCheer;
export let mediumCheer;
export let bigCheer;
export let music;

export const load = () => {

	buttonTex = getTexture(require('../pics/button.png'));
	gameoverButtonTex = getTexture(require('../pics/gameover.png'));
	restartButtonTex = getTexture(require('../pics/restart.png'));
	buttonTex.generateMipmaps = true;
	gameoverButtonTex.generateMipmaps = true;
	restartButtonTex.generateMipmaps = true;
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
            smallCheer.setVolume(0.25);
        }, function ( xhr ) {
      
    });
    mediumCheer = new THREE.Audio(listener);
    let medCheerLoader = new THREE.AudioLoader();
    medCheerLoader.load(mediumCheerFile, 
        function(buffer){
            mediumCheer.setBuffer( buffer );
            mediumCheer.setLoop(false);
            mediumCheer.setVolume(0.5);
        }, function ( xhr ) {
      
    });
    bigCheer = new THREE.Audio(listener);
    let bigCheerLoader = new THREE.AudioLoader();
    bigCheerLoader.load(xtraBigCheerFile, 
        function(buffer){
            bigCheer.setBuffer( buffer );
            bigCheer.setLoop(false);
            bigCheer.setVolume(0.6);
            init();
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
        }, function ( xhr ) {
      		console.log(xhr);
    });
}


