import * as THREE from 'three';
import * as Initialize from './Initialize.js';
import * as CollisionDetection from './CollisionDetection.js';
import * as Locations from './locations.js';

let gameState = "during";
let level = 0;
let time = 10000;
let timer = 0;
let playerPoints = 0;

export let myTimer;

let levels = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
let points = 100;
let questions = [4, 5, 6, 7, 8, 9, 10 , 11, 12, 13];
let mapIndex = [0, 1, 0, 1, 1, 1, 1, 2, 2, 2, 3 ,3 , 3];
let maps = []
let currentQuestion = 1;

let renderer = Initialize.renderer;
let camera = Initialize.camera;
let scene = Initialize.scene;
export let windowOffset = 125;
export let windowOffsetY = -20;

// let portland = 43.6591;
// let xCoord = -70.2568;

let bg = Initialize.background;
let button = Initialize.button;
let gameOverButton = Initialize.gameoverButton;
let restartButton = Initialize.restartButton;

//+-1700 px x coord = 180 degrees east/west
//971 y coord = 90 degrees north/south

let mouse = {
    clientX: 0,
    clientY:0
}

let vec = new THREE.Vector3(0,0,0);
let pos = new THREE.Vector3(0,0,0);

document.addEventListener("mouseup", function(event){
    getMouseCoords(event);
    getMousePos();
    if (gameState == "during")
        getMapCoords();
    else if (gameState == "after")
        getButtonCoords();
    else if (gameState == "game over")
        getRestartCoords();
});

const getMapCoords = () => {
    if (!bg) bg = Initialize.background;
    let mapPos = new THREE.Vector3();
    mapPos.set(bg.position.x, bg.position.y, bg.position.z);
    let width = bg.geometry.parameters.width;
    let height = bg.geometry.parameters.height;
    if (checkMapCollision(pos, bg)){
        let tmp = new THREE.Vector3();
        tmp.set(pos.x, pos.y, pos.z);
        tmp.sub(mapPos);
        convertToLatLong(tmp);
        (pos, tmp, convertLatLongToWorldCoords(tmp));
        let cityPosition = new THREE.Vector3();
        cityPosition.set(currentCity.latLong.x, currentCity.latLong.y, 0);
        let distance = convertLatLongToWorldCoords(cityPosition).distanceTo(pos);
        makeCircle(distance, cityPosition);
        window.clearTimeout(myTimer);
        showScore(distance);
    }
}

const  getButtonCoords = () => {
    if (checkMapCollision(pos, button)){
        currentQuestion++;
        makeHTMLScoreboard();
        clearScreen();
        gameState = "during";
        currentCity = Locations.getRandomLocation();
        myTimer = window.setTimeout(showScore, time);
    }
}

const getRestartCoords = () => {
    if (checkMapCollision(pos, restartButton)){
        clearScreen();
        gameState = "during";
        playerPoints = 0;
        level = 0;
        currentQuestion = 1;
        makeHTMLScoreboard();
        // questions = 5;
        currentCity = Locations.getRandomLocation();
        myTimer = window.setTimeout(showScore, time);
    }
}


export const showScore = (distance) => {
    if (!distance) distance = 10000;
    if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
    if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
    if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
    if (distance < 15){
        if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
        Initialize.bigCheer.play();
    } else if (distance < 75) {
        if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
        Initialize.mediumCheer.play();
    } else if (distance < 200) {
        if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
        Initialize.smallCheer.play();
    }
    if (distance > 1000){
        distance = 1000;
    } else {
        playerPoints += Math.round((points * (1 - (distance/500))));
    }
    makeHTMLScoreboard();
    if (currentQuestion == questions[level]) {
        if (levels[level] <= playerPoints){
            level++;
            currentQuestion = 1;
            playerPoints = 0;
            Initialize.setBackground(mapIndex[level]);
        } else {
            gameState = "game over";
            showGameOver();
            return;
        }
    }
    gameState = "after";
    if (!button) button = Initialize.button;
    scene.add(button);
}

let playerPointsText;
let questionsText;
let levelText;
let resultText;

export const makeHTMLScoreboard = (distance) => {
    if (!playerPointsText){
        playerPointsText = document.createElement('div');
        playerPointsText.style.position = 'absolute';
        //playerPointsText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        playerPointsText.style.width = 100;
        playerPointsText.style.height = 100;
        playerPointsText.style.backgroundColor = "green";
        playerPointsText.style.top = window.innerHeight / 2 - 20 + 'px';
        playerPointsText.style.left = 10 + 'px';
        document.body.appendChild(playerPointsText);
    }
    playerPointsText.innerHTML = "Points: " + playerPoints + "/" + levels[level];

    if (!questionsText){
        questionsText = document.createElement('div');
        questionsText.style.position = 'absolute';
        //questionsText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        questionsText.style.width = 100;
        questionsText.style.height = 100;
        questionsText.style.backgroundColor = "green";
        questionsText.style.top = window.innerHeight / 2 - 40 + 'px';
        questionsText.style.left = 10 + 'px';
        document.body.appendChild(questionsText);
    }
    questionsText.innerHTML = "Question: " + currentQuestion + "/" + questions[level];

    if (!levelText){
        levelText = document.createElement('div');
        levelText.style.position = 'absolute';
        //levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        levelText.style.width = 100;
        levelText.style.height = 100;
        levelText.style.backgroundColor = "green";
        levelText.style.top = window.innerHeight / 2 - 60 + 'px';
        levelText.style.left = 10 + 'px';
        document.body.appendChild(levelText);
    }
    levelText.innerHTML = "Level: " + (level + 1);

    if (!resultText){
        resultText = document.createElement('div');
        resultText.style.position = 'absolute';
        //levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        resultText.style.width = 100;
        resultText.style.height = 100;
        resultText.style.backgroundColor = "green";
        resultText.style.top = window.innerHeight / 2 - 60 + 'px';
        resultText.style.left = 10 + 'px';
        document.body.appendChild(resultText);
    }
    resultText.innerHTML = "Result: " + distance;
}

const showGameOver = () => {
    window.clearTimeout(myTimer);
    if (!gameOverButton) gameOverButton = Initialize.gameoverButton;
    if (!restartButton) restartButton = Initialize.restartButton;
    Initialize.scene.add(gameOverButton);
    Initialize.scene.add(restartButton);
}

const clearScreen = () => {
    scene.remove.apply(scene, scene.children);
    Initialize.init();
}

const makeCircle = (distance, position) => {
    let tmp = new THREE.Vector3(position.x, position.y, 0);
    tmp = convertLatLongToWorldCoords(tmp);
    // convertToPixelCoords(tmp);
    let geometry = new THREE.CircleGeometry( distance, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.2, transparent: true } );
    var circle = new THREE.Mesh( geometry, material );
    circle.position.set(tmp.x, tmp.y, 1);
    scene.add( circle );
    geometry = new THREE.CircleGeometry( 6, 32 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
    var circle2 = new THREE.Mesh( geometry, material );
    circle2.position.set(tmp.x, tmp.y, 1);
    scene.add( circle2 );
    geometry = new THREE.RingGeometry( distance-4, distance, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(tmp.x, tmp.y, 1);
    scene.add( mesh );
}

const compareLocations = (a, b) => {

}

const convertLatLongToWorldCoords = (vec) => {
    let tmp = new THREE.Vector3(vec.x, vec.y, 0);
    convertToPixelCoords(tmp);
    return tmp;
}

const convertToLatLong = (vec) => {
    vec.x += windowOffset;
    vec.y += windowOffsetY
    vec.x /= 12;
    vec.y /= 14.5;
}

export const convertToPixelCoords = (vec) => {
    vec.x *= 12;
    vec.y *= 14.5;
    vec.x -= windowOffset;
    vec.y -= windowOffsetY;
    let mapPos = new THREE.Vector3();
    if (bg) {
        mapPos.set(bg.position.x, bg.position.y, bg.position.z);
        vec.add(mapPos);
    }
}

let portland = Locations.newLocation("Portland", "Maine", 43.6591, -70.2568);
Locations.locations.push(portland);
let locations = Locations.locations;
Locations.getLocations();
let currentCity = Locations.getRandomLocation();

const getMouseCoords = (event) => {
    mouse.clientX = event.clientX;
    mouse.clientY = event.clientY;
    // mouse.clientX -= windowOffset;
    // mouse.clientY -= windowOffsetY;
}

const getMousePos = () => {
    let targetZ = 0;
    vec.set(
    ( mouse.clientX / renderer.domElement.width ) * 2 - 1,
    - ( mouse.clientY / renderer.domElement.height ) * 2 + 1,
    0.5 );
    vec.unproject( camera );
    vec.sub( camera.position ).normalize();
    let distance = ( targetZ - camera.position.z ) / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
}

const checkMapCollision = (a, b) => {
    if (!b) return false;
    let bP = b.position;
    let bWidth = b.geometry.parameters.width;
    let bHeight = b.geometry.parameters.height;
    let bXmin = bP.x - bWidth/2;
    let bXmax = bP.x + bWidth/2;
    let bYmin = bP.y - bHeight/2;
    let bYmax = bP.y + bHeight/2;

    if (a.x > bXmax) return false; // a is left of b
    if (a.x < bXmin) return false; // a is right of b
    if (a.y < bYmin) return false; // a is below 
    if (a.y > bYmax) return false; // a is above

    return true; // boxes overlap
}


