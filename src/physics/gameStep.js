import * as THREE from 'three';
import * as Initialize from './Initialize.js';
import * as CollisionDetection from './CollisionDetection.js';
import * as Locations from './locations.js';
import * as App from '../app.js';

let level = 0;
let time = 10000;
let timer = 0;
let playerPoints = 0;
let distanceFromPoint = 10000000;
let resultPoints = 0;

export let myTimer;

let levels = [100, 150, 200, 230, 260, 290, 325, 375, 450, 550];
let points = 100;
let questions = [3, 4, 5, 5, 5, 6, 6 , 6, 7, 8];
let mapIndex = [0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 3 ,3 , 3];
let maps = []
let currentQuestion = 1;

export let windowOffset = 125;
export let windowOffsetY = -20;

// let portland = 43.6591;
// let xCoord = -70.2568;

let bg = Initialize.background;
let button = Initialize.button;
let gameOverButton = Initialize.gameoverButton;
let restartButton = Initialize.restartButton;
let startButton = Initialize.startButton;
let winButton = Initialize.winButton;

export const setButtons = () => {
    bg = Initialize.background;
    button = Initialize.button;
    gameOverButton = Initialize.gameoverButton;
    restartButton = Initialize.restartButton;
    startButton = Initialize.startButton;
}

//+-1700 px x coord = 180 degrees east/west
//971 y coord = 90 degrees north/south

let scene = Initialize.scene;
let renderer = Initialize.renderer;
let camera = Initialize.camera;

export const setThreeJSElements = () => {  
    scene = Initialize.scene;
    renderer = Initialize.renderer;
    camera = Initialize.camera;
}

let mouse = {
    clientX: 0,
    clientY:0
}

let vec = new THREE.Vector3(0,0,0);
let pos = new THREE.Vector3(0,0,0);


document.addEventListener("mouseup", function(event){
    Initialize.click.play();
    getMouseCoords(event);
    getMousePos();
    if (App.getGameState() == "during")
        getMapCoords();
    else if (App.getGameState() == "after"){
        getButtonCoords(button);
    }
    else if (App.getGameState() == "game over")
        getRestartCoords();
    else if (App.getGameState() == "before"){
        makeHTMLScoreboard();
        getButtonCoords(startButton);
    }
});

let distances = [];

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
        distanceFromPoint = calculateScore(tmp.x, tmp.y, currentCity.latLong.x, currentCity.latLong.y);
        (pos, tmp, convertLatLongToWorldCoords(tmp));
        let cityPosition = new THREE.Vector3();
        cityPosition.set(currentCity.latLong.x, currentCity.latLong.y, 0);
        let distance = convertLatLongToWorldCoords(cityPosition).distanceTo(pos);
        makeCircle(distance, cityPosition);
        distances = [distance, distanceFromPoint];
        App.setGameState("animation");
        // window.clearTimeout(myTimer);
        // showScore(distance, distanceFromPoint);
    }
}

const getButtonCoords = (b) => {
    if (checkMapCollision(pos, b)){
        currentQuestion++;
        clearScreen();
        App.setGameState("during");
        makeHTMLScoreboard();
        // scene.add(App.bar);
        currentCity = Locations.getRandomLocation();
        // myTimer = window.setTimeout(showScore, time);
        App.resetTime();
    }
}


const getRestartCoords = () => {
    if (checkMapCollision(pos, restartButton)){
        level = 0;
        Initialize.setBackground(mapIndex[level]);
        clearScreen();
        App.setGameState("during");
        playerPoints = 0;
        currentQuestion = 1;
        makeHTMLScoreboard();
        App.resetTime();
        // questions = 5;
        currentCity = Locations.getRandomLocation();
        // myTimer = window.setTimeout(showScore, time);
    }
}


export const showScore = (distance, distanceMi) => {
    if (!distance) distance = 10000;
    if (!distanceMi) distanceMi = 10000;
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
    if (distanceMi > 2000){
        distanceMi = 2000;
    }
    let x = distanceMi / 2000;
    x = 1 - x;
    x = x * x;
    resultPoints = Math.round(points * x);
    if (resultPoints < 0) resultPoints = 0;
    playerPoints += resultPoints;
    makeHTMLScoreboard();
    if (currentQuestion == questions[level]) {
        if (levels[level] <= playerPoints){
            level++;
            if (level == 10) {
                App.setGameState("game over");// = "game over";
                showGameOver("win");
                return;
                level = 0;
            }
            currentQuestion = 1;
            playerPoints = 0;
            Initialize.setBackground(mapIndex[level]);
        } else {
            App.setGameState("game over");// = "game over";
            showGameOver("lose");
            return;
        }
    }
    App.setGameState("after");// = "after";
    makeHTMLScoreboard();
    if (!button) button = Initialize.button;
    scene.add(button);
}

let playerPointsText;
let questionsText;
let levelText;
let resultText;
let resultPointsText;

export const makeHTMLScoreboard = (distance) => {
    let left;
    if (App.getGameState() == "during") left = 10 + 'px';
    else if (App.getGameState() == "after") left = innerWidth/2 + 'px';
    if (!playerPointsText){
        playerPointsText = document.createElement('div');
        playerPointsText.style.position = 'absolute';
        //playerPointsText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        playerPointsText.style.width = 100;
        playerPointsText.style.height = 100;
        playerPointsText.style.backgroundColor = "green";
        playerPointsText.style.top = window.innerHeight / 2 - 20 + 'px';
        playerPointsText.style.left = left;
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
        questionsText.style.left = left;
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
        levelText.style.left = left;
        document.body.appendChild(levelText);
    }
    levelText.innerHTML = "Level: " + (level + 1);

    if (App.getGameState() == 'after'){
        if (!resultText){
            resultText = document.createElement('div');
            resultText.style.position = 'absolute';
            //levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
            resultText.style.width = 100;
            resultText.style.height = 100;
            resultText.style.backgroundColor = "yellow";
            resultText.style.top = window.innerHeight / 2 + 20 + 'px';
            resultText.style.left = left;
            document.body.appendChild(resultText);
        }
        resultText.style.display = "inline-block";
        if (distanceFromPoint == 1000000) resultText.innerHTML = "Result: N/A mi.";
        else resultText.innerHTML = "Result: " + distanceFromPoint + " mi.";
    } else if (resultText) resultText.style.display = "none";
    
    if (App.getGameState() == 'after'){
        if (!resultPointsText){
            resultPointsText = document.createElement('div');
            resultPointsText.style.position = 'absolute';
            //levelText.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
            resultPointsText.style.width = 100;
            resultPointsText.style.height = 100;
            resultPointsText.style.backgroundColor = "yellow";
            resultPointsText.style.top = window.innerHeight / 2 + 40 + 'px';
            resultPointsText.style.left = left;
            document.body.appendChild(resultPointsText);
        }
        resultPointsText.style.display = "inline-block";
        resultPointsText.innerHTML = "Points: " + resultPoints;
    } else if (resultPointsText) resultPointsText.style.display = "none";
}

const calculateScore = (lat1, lon1, lat2, lon2) => {
    var R = 6371e3; // metres
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2-lat1);
    var Δλ = toRadians(lon2-lon1);

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    return Math.round(((d/1000) * 0.621371) * 10)/10;
}

const toRadians = (degrees) => {
    var pi = Math.PI;
    return degrees * (pi/180);
}

const showGameOver = (result) => {
    // window.clearTimeout(myTimer);
    if (result == "win") {
        if (!winButton) winButton = Initialize.winButton;
        Initialize.scene.add(winButton);
    }
    if (result == "lose") {
        if (!gameOverButton) gameOverButton = Initialize.gameoverButton;
        Initialize.scene.add(gameOverButton);
    }
    if (!restartButton) restartButton = Initialize.restartButton;
    Initialize.scene.add(restartButton);
}

const clearScreen = () => {
    scene.remove.apply(scene, scene.children);
    App.render();
    Initialize.init();
}

let circle;
let circle3;
let radius = 0;

export const updateCircleRadius = () => {
    circle.scale.set(circle.scale.x + 50, circle.scale.y + 50, 1);
    scene.remove(circle3);
    let geometry = new THREE.RingGeometry( circle.scale.x-4, circle.scale.x, Math.round(distances[0]) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    circle3 = new THREE.Mesh( geometry, material );
    circle3.position.set(circle.position.x, circle.position.y, 1);
    scene.add(circle3);
    if (circle.scale.x >= distances[0]) {
        circle.scale.set(distances[0], distances[0], 1);
        scene.remove(circle3);
        let geometry = new THREE.RingGeometry( circle.scale.x-10, circle.scale.x, Math.round(distances[0]) );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
        circle3 = new THREE.Mesh( geometry, material );
        circle3.position.set(circle.position.x, circle.position.y, 1);
        scene.add(circle3);
        showScore(distances[0], distances[1]);
    }
}

const makeCircle = (distance, position) => {
    let tmp = new THREE.Vector3(position.x, position.y, 0);
    tmp = convertLatLongToWorldCoords(tmp);
    // convertToPixelCoords(tmp);
    let geometry = new THREE.CircleGeometry( 1, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.2, transparent: true } );
    circle = new THREE.Mesh( geometry, material );
    circle.position.set(tmp.x, tmp.y, 1);
    scene.add( circle );
    geometry = new THREE.CircleGeometry( 9, 32 );
    material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
    var circle2 = new THREE.Mesh( geometry, material );
    circle2.position.set(tmp.x, tmp.y, 1);
    scene.add( circle2 );
    geometry = new THREE.RingGeometry( 0, 4, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    circle3 = new THREE.Mesh( geometry, material );
    circle3.position.set(tmp.x, tmp.y, 1);
    scene.add( circle3 );
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

let portland = Locations.newLocation("Portland", "Maine", "United States", 43.6591, -70.2568);
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


