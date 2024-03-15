import * as THREE from 'three';
import * as App from'../app.js';
import {setThreeJSElements, setButtons, restyleHTML} from './gameStep.js';
import * as Loc from './locations.js';
import * as Utils from './utils.js';

const mapSizeX = 5000;
const mapSizeY = 2500;
const mapSquishY = 100;
const mapSquishX = -100;
// const mapSizeX = 1000;
// const mapSizeY = 500;

const margin = 4;

let height = window.innerHeight-margin;
let width = window.innerWidth-margin;

export let scene = new THREE.Scene();
// export let camera = new THREE.PerspectiveCamera(75, (window.innerWidth-margin) / (window.innerHeight-margin), 0.1, 10001);
export let camera = new THREE.PerspectiveCamera(75, mapSizeX / mapSizeY, 0.1, 10001);
// export let camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 10001 );
export let renderer = new THREE.WebGLRenderer();
// renderer.sortObjects = false;

setThreeJSElements();

let canvasParent = document.createElement('div');

renderer.domElement.id = 'canvas';
camera.position.z = 1400;
//console.log('ratio', height/width);
// if (height/width > .55) {
// 	camera.position.z = 2075;
// 	//console.log('qwerty');
// 	height = width * .75;
// 	// renderer.domElement.style.width = width + 'px';
// 	// renderer.domElement.style.height = height + 'px';
// 	renderer.domElement.style.position= 'fixed';
// 	renderer.domElement.style.top = 50 + '%';
// 	renderer.domElement.style.left = 50 + '%';
// 	renderer.domElement.style.transform =  'translate(-50%, -50%)';
// }
renderer.setSize(mapSizeX, mapSizeY);

camera.aspect = width/height;
camera.updateProjectionMatrix();

document.body.appendChild( renderer.domElement );	

renderer.setSize( width, height );
document.body.appendChild( renderer.domElement );	

//export let windowOffset = (((window.innerWidth) - (window.innerHeight - margin) * 2) / 2 + window.left) + 'px';

let windowOffset = Utils.getWindowOffset();

window.addEventListener('resize', () => {
	// if (window.innerHeight/window.innerWidth > .55) {
	// 	fontSize = (window.innerWidth * .55)/40 + 'px';
	// }
	windowOffset = Utils.getWindowOffset();
	height = window.innerHeight-margin;
	width = window.innerWidth-margin;
	renderer.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
	if (App.getGameState() != "loading" && App.getGameState() != "loading done"){
		restyleHTML(windowOffset);
		App.restyleHTMLApp(windowOffset);
		Loc.restyleHTMLLoc(windowOffset);
	} else {
		App.restyleHighScoreboard();
		updateLoaderBar();
	}
});

camera.position.z = 2000;

export let background;
export let button;
export let gameoverButton;
export let restartButton;
export let startButton;
export let winButton;
export let title;
export let submitButton;
export let menuButton;
export let highscoresButton;

export let bgTex;
let physicalTex;
let bordersTex;
let secondaryTex;
let blankTex;
let titleTex;
export let maps = [];
let buttonTex;
let startTex;
let gameoverButtonTex;
let restartButtonTex;
let winButtonTex;
let submitTex;
let menuTex;
let highscoresTex;

let bar = App.bar;

export let fontSize = Utils.getFontSize();

export const setBackground = (tex) => {
	background = maps[tex];
}

const addBackgroundPlates = (geom, mat, width, height) => {
	let i = 0;
	let x = [-1,-1,-1, 0, 0, 1, 1, 1];
	let y = [-1, 0, 1,-1, 1,-1, 0, 1];
	while (i < 8){
		let plate = new THREE.Mesh(geom, mat);
		scene.add(plate);
		let xPos = width * x[i];
		let pos = new THREE.Vector3(width * x[i], height * y[i], 5);
		plate.position.x = pos.x;
		plate.position.y = pos.y;
		plate.position.z = pos.z;
		i++;
	}
}

export const init = () => {
 	// let geom = new THREE.PlaneGeometry(4378, 2435,32);
 	let plateWidth = mapSizeX - mapSquishX;
 	let plateHeight = mapSizeY - mapSquishY
 	let geom = new THREE.PlaneGeometry(plateWidth, plateHeight,32);
 	let buttonGeomXDim = 400;
 	let buttonGeomYDim = 200;
 	// let geom = new THREE.PlaneGeometry(1000, 500,32);
 	let geom2 = new THREE.PlaneGeometry(10000, 5000,32);
 	let mat = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide});
 	let bgPlate = new THREE.Mesh (geom2, mat);
 	addBackgroundPlates(geom, mat, plateWidth, plateHeight);
 	// addBackgroundPlates(geom, mat, plateWidth, plateHeight);
 	scene.add(bgPlate);
 	let middleHeight = 200;
 	let lowerHeight = -200;
	if (!background){
		background = getBackgroundMesh( bgTex , 0, -1, geom, 1 );
	}
 	if (!button){
 		geom = new THREE.PlaneGeometry(buttonGeomXDim, buttonGeomYDim, 32);
    	mat = new THREE.MeshBasicMaterial({map: buttonTex, side: THREE.DoubleSide});
 		button = new THREE.Mesh(geom, mat);
 		button.material.transparent = true;
 		button.material.opacity = .7;
 		button.position.y = middleHeight;//window.innerHeight/2- 100;
    	button.position.x = 0;
    	button.position.z = 2;
 	}
 	if (!gameoverButton){
 		gameoverButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: gameoverButtonTex, side: THREE.FrontSide}));
 		gameoverButton.material.transparent = true;
 		gameoverButton.material.opacity = .7;
 		gameoverButton.position.y = middleHeight;//window.innerHeight/2 - 100;
    	gameoverButton.position.x = 0;
    	gameoverButton.position.z = 2;
 	}
 	if (!restartButton){
 		restartButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: restartButtonTex, side: THREE.FrontSide}));
 		restartButton.material.transparent = true;
 		restartButton.material.opacity = .7;
 		restartButton.position.y = lowerHeight;//window.innerHeight/2 - 450;
    	restartButton.position.x = 0;
    	restartButton.position.z = 2;
 	}
 	if (!startButton){
 		startButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: startTex, side: THREE.FrontSide}));
 		startButton.material.transparent = true;
 		startButton.material.opacity = .7;
 		startButton.position.y = middleHeight;//window.innerHeight/2 - 100;
    	startButton.position.x = 0;
    	startButton.position.z = 2;
 	}
 	 if (!winButton){
 		winButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: winButtonTex, side: THREE.FrontSide}));
 		winButton.material.transparent = true;
 		winButton.material.opacity = .7;
 		winButton.position.y = middleHeight;//window.innerHeight/2 - 100;
    	winButton.position.x = 0;
    	winButton.position.z = 2;
 	}
 	 if (!submitButton){
 		submitButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: submitTex, side: THREE.FrontSide}));
 		submitButton.material.transparent = true;
 		submitButton.material.opacity = .7;
 		submitButton.position.y = 600;//window.innerHeight/2 + 350;
    	submitButton.position.x = 0;
    	submitButton.position.z = 2;
 	}
 	if (!menuButton){
 		menuButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: menuTex, side: THREE.FrontSide}));
 		menuButton.material.transparent = true;
 		menuButton.material.opacity = .7;
 		menuButton.position.y = -400;//window.innerHeight/2 - 800;
    	menuButton.position.x = 0;
    	menuButton.position.z = 2;
 	}
 	if (!highscoresButton){
 		highscoresButton = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({map: highscoresTex, side: THREE.FrontSide}));
 		highscoresButton.material.transparent = true;
 		highscoresButton.material.opacity = .7;
 		highscoresButton.position.y = -100;//window.innerHeight/2 - 450;
    	highscoresButton.position.x = 0;
    	highscoresButton.position.z = 2;
 	}
 	// background.material.depthTest = false;
 	// background.renderOrder = 1;
	scene.add(background);
	background.position.x = 75;
	// scene.add(backgroundSquare);
}

const getBackgroundMesh = (tex, zPos, yPos, geom, repeat, index) => {
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

export let textureLoadingProgress = 0;
let arrProgress = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const getTexture = (path, index) => {
	let tex = new THREE.TextureLoader().load(path.toString(), function(){
		arrProgress[index] = 1;
	});
	tex.generateMipmaps = false;
	return tex;
}

export const setMusic = (i) => {
	//console.log(songs);
	if (song)
		song.stop();
	song = songs[i];
	song.play();
}

let listener;
let smallCheerFile = require("../sfx/smallCheer.mp3"); 

let mediumCheerFile = require("../sfx/mediumCheer.mp3");
let xtraBigCheerFile = require("../sfx/xtraBigCheer.mp3");
let musicFile = require("../sfx/lofi.mp3");
// let music2File = require('../sfx/perroLoco.mp3').default;
// let music3File = require('../sfx/20s.mp3').default;
let clickFile = require("../sfx/click.mp3");

export let smallCheer;// = new THREE.Audio();
export let mediumCheer;// = new THREE.Audio();
export let bigCheer;// = new THREE.Audio();
export let music;// = new THREE.Audio();
export let music2;
export let music3;
export let click;// = new THREE.Audio();

let songs;
let song;

//Not used anywhere, songs 2 and 3 are not loaded/heard
export const setSongs = () => {
	songs = [music, music2, music3];
	song = music3;
}

let htmlLoadingBar;
let htmlLoadingText;

export const updateLoaderBar = () => {
	let sum = 0
	for (var i = arrProgress.length - 1; i >= 0; i--) {
		sum += arrProgress[i];
	}
	textureLoadingProgress = sum;
	htmlLoadingBar.style.width = 125 + 'px';

	htmlLoadingBar.style.backgroundColor = "#0f0";
	// if (window.innerHeight/window.innerWidth > .55) {
	// 	htmlLoadingBar.style.height = (window.innerWidth*.55)/20 + 'px';
	// 	htmlLoadingBar.style.top = (window.innerWidth*.55) / 2 - (window.innerWidth*.55)/9 + 'px'; //+40
	// 	htmlLoadingBar.style.width = ((window.innerWidth*.55)/2) * (textureLoadingProgress/arrProgress.length) + 'px';
	// 	htmlLoadingBar.style.left = window.innerWidth/2.5 + 'px';
	// 	// htmlLoadingBar.style.position= 'fixed';
	// 	htmlLoadingBar.style.top = 50 + '%';
	// 	htmlLoadingBar.style.left = 40 + '%';
	// 	htmlLoadingText.style.fontSize = fontSize;
	// 	htmlLoadingText.style.color = "#0f0";
	// 	htmlLoadingText.style.top = (window.innerWidth*.55) / 2 - (window.innerWidth*.55)/6 + 'px'; //+40
	// 	htmlLoadingText.style.left = window.innerWidth/2.5 + 'px';
	// 	htmlLoadingText.innerHTML = "Loading " + (textureLoadingProgress/arrProgress.length * 100).toFixed(2) + "%";
	// 	htmlLoadingText.style.top = 47 + '%';
	// 	htmlLoadingText.style.left = 40 + '%';
	// } else {
		htmlLoadingBar.style.height = window.innerHeight/20 + 'px';
		htmlLoadingBar.style.top = window.innerHeight / 2 - window.innerHeight/9 + 'px'; //+40
		htmlLoadingBar.style.width = (window.innerHeight/2) * (textureLoadingProgress/arrProgress.length) + 'px';
		htmlLoadingBar.style.left = window.innerWidth/2.5 + 'px';
		htmlLoadingText.style.fontSize = fontSize;
		htmlLoadingText.style.color = "#0f0";
		htmlLoadingText.style.top = window.innerHeight / 2 - window.innerHeight/6 + 'px'; //+40
		htmlLoadingText.style.left = window.innerWidth/2.5 + 'px';
		htmlLoadingText.innerHTML = "Loading " + (textureLoadingProgress/arrProgress.length * 100).toFixed(2) + "%";
	// }
}

export const removeLoaderBar = () => {
	htmlLoadingBar.style.display = 'none';
	htmlLoadingText.style.display = 'none';
}

export const load = () => {
    App.incrementPlayCount();
	htmlLoadingBar = document.createElement('div');
	htmlLoadingBar.id = 'loading-bar';
	htmlLoadingBar.style.position = 'absolute';
	htmlLoadingText = document.createElement('div');
	htmlLoadingText.style.position = 'absolute';
	htmlLoadingText.innerHTML = 'Loading';
	htmlLoadingText.style.fontSize = fontSize;
	htmlLoadingText.style.color = "#0f0";
	htmlLoadingText.style.top = window.innerHeight / 2 - window.innerHeight/6 + 'px'; //+40
	htmlLoadingText.style.left = window.innerWidth/2.5 + 'px';
	document.body.appendChild(htmlLoadingBar);
	document.body.appendChild(htmlLoadingText);
	updateLoaderBar();

	titleTex = getTexture(require('../pics/title2.png').default, 15);
	titleTex.generateMipmaps = true;
	titleTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
	title = new THREE.Mesh(new THREE.PlaneGeometry(2000,400,32), new THREE.MeshBasicMaterial({map:titleTex, side:THREE.FrontSide, transparent:true}));
	buttonTex = getTexture(require('../pics/button.png').default, 0);
	submitTex = getTexture(require('../pics/submit.png').default, 16);
	menuTex = getTexture(require('../pics/menu.png').default, 17);
	highscoresTex = getTexture(require('../pics/highscores.png').default, 18);
	gameoverButtonTex = getTexture(require('../pics/gameover.png').default, 1);
	restartButtonTex = getTexture(require('../pics/restart.png').default, 2);
	startTex = getTexture(require('../pics/start.png').default, 3);
	winButtonTex = getTexture(require('../pics/win.png').default, 4);
	buttonTex.generateMipmaps = true;
	submitTex.generateMipmaps = true;
	menuTex.generateMipmaps = true;
	highscoresTex.generateMipmaps = true;
	gameoverButtonTex.generateMipmaps = true;
	restartButtonTex.generateMipmaps = true;
	startTex.generateMipmaps= true;
	winButtonTex.generateMipmaps = true;
	bordersTex = getTexture(require('../pics/with_borders.png').default, 5);
	blankTex = getTexture(require('../pics/red.png').default, 6);
	physicalTex = getTexture(require('../pics/physical.png').default, 7);
	secondaryTex = getTexture(require('../pics/secondary.png').default, 8);
	// let geom = new THREE.PlaneGeometry(4378, 2435,32);
	let geom = new THREE.PlaneGeometry(mapSizeX - mapSquishX, mapSizeY - mapSquishY,32);
	maps.push(getBackgroundMesh(secondaryTex , 0, 0, geom, 1));
	maps.push(getBackgroundMesh(bordersTex , 0, 0, geom, 1));
	maps.push(getBackgroundMesh(physicalTex , 0, 0, geom, 1));
	maps.push(getBackgroundMesh(blankTex , 0, 0, geom, 1));
	bgTex = new THREE.TextureLoader().load(require('../pics/physical.png').default, function () {
		arrProgress[9] = 1;
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
      		arrProgress[10] = xhr.loaded / xhr.total;
    });
    mediumCheer = new THREE.Audio(listener);
    let medCheerLoader = new THREE.AudioLoader();
    medCheerLoader.load(mediumCheerFile, 
        function(buffer){
            mediumCheer.setBuffer( buffer );
            mediumCheer.setLoop(false);
            mediumCheer.setVolume(0.4);
        }, function ( xhr ) {
      		arrProgress[11] = xhr.loaded / xhr.total;
    });
    bigCheer = new THREE.Audio(listener);
    let bigCheerLoader = new THREE.AudioLoader();
    bigCheerLoader.load(xtraBigCheerFile, 
        function(buffer){
            bigCheer.setBuffer( buffer );
            bigCheer.setLoop(false);
            bigCheer.setVolume(0.4);
        }, function ( xhr ) {
      		arrProgress[12] = xhr.loaded / xhr.total;
    });
    click = new THREE.Audio(listener);
    let clickLoader = new THREE.AudioLoader();
    clickLoader.load(clickFile, 
        function(buffer){
            click.setBuffer( buffer );
            click.setLoop(false);
            click.setVolume(0.4);
        }, function ( xhr ) {
 			arrProgress[13] = xhr.loaded / xhr.total;
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
      		arrProgress[14] = xhr.loaded / xhr.total;
    });
    // music2 = new THREE.Audio(listener);
    // let music2Loader = new THREE.AudioLoader();
    // music2Loader.load(music2File, 
    //     function(buffer){
    //         music2.setBuffer( buffer );
    //         music2.setLoop(true);
    //         music2.setVolume(0.5);
    //         // music2.play();
    //     }, function ( xhr ) {
    //   		arrProgress[19] = xhr.loaded / xhr.total;
    // });
    // music3 = new THREE.Audio(listener);
    // let music3Loader = new THREE.AudioLoader();
    // music3Loader.load(music3File, 
    //     function(buffer){
    //         music3.setBuffer( buffer );
    //         music3.setLoop(true);
    //         music3.setVolume(0.5);
    //         music3.play();
    //     }, function ( xhr ) {
    //   		arrProgress[20] = xhr.loaded / xhr.total;
    // });
}


