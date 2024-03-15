import * as THREE from 'three';
import * as Initialize from './Initialize.js';
import * as CollisionDetection from './CollisionDetection.js';
import * as Locations from './locations.js';
import * as App from '../app.js';
import * as Utils from './utils.js';
// var createGeometry = require('three-bmfont-text')
// var loadFont = require('load-bmfont')


let level = 0;
let time = 10000;
let timer = 0;
let playerPoints = 0;
let totalPoints = 0;
let distanceFromPoint = 10000000;
let resultPoints = 0;
let guessLat = 0;
let guessLong = 0;
let answerLat = 0;
let answerLong = 0;


//circle animations
let circle;
let circle3;
let radius = 0;
let circleStart = 0
let circle4;
let circle5;
let circle6;
let circleSpeed = .3;
let elapsedTime = 0;
let currentTime = 0;
let circleProgress = 0;
let twoCircles = false;

export let myTimer;

let levels = [125, 200, 275, 300, 325, 415, 415, 415, 500, 580]; //580
// let numLocs = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];
let numLocs = [50, 100, 200, 500, 750, 1000, 5000, 5000, 10000, 15000];
let musicIndex = [0, 0, 1, 1, 0, 0, 0, 2, 2, 2];
let points = 100;
let questions = [3, 4, 5, 5, 5, 6, 6 , 6, 7, 8];
let mapIndex = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3];
let maps = []
let currentQuestion = 1;

export let windowOffset = 125; //was 125
export let windowOffsetY = -30;

// let portland = 43.6591;
// let xCoord = -70.2568;

let bg = Initialize.background;
let button = Initialize.button;
let gameOverButton = Initialize.gameoverButton;
let restartButton = Initialize.restartButton;
let startButton = Initialize.startButton;
let winButton = Initialize.winButton;
let menuButton = Initialize.menuButton;
let highscoresButton = Initialize.highscoresButton;
let submitButton = Initialize.submitButton;
let background = Initialize.background;

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
    getMouseCoords(event);
    getMousePos();
    if (App.getGameState() != "animation") playSound(Initialize.click);//.play();
    if (App.getGameState() == "loading done"){
        getStartButtonCoords();
        getHighscoresButtonCoords();
        getMenuCoords();
    }
    else if (App.getGameState() == "during"){
        getMapCoords();
    }
    else if (App.getGameState() == "after"){
        getButtonCoords();
    }
    else if (App.getGameState() == "game over"){
        getRestartCoords();
        getMenuCoords();
        getSubmitCoords();
    }
});

const playSound = (sound) => {
    if (!App.mute){
        sound.play();
    }
}


document.addEventListener("keydown", function(event){
    if (event.keyCode == 77) { //m
        App.toggleMute();
        if (App.mute) {
            Initialize.music.setVolume(0);
            Initialize.bigCheer.setVolume(0)
            Initialize.smallCheer.setVolume(0)
            Initialize.mediumCheer.setVolume(0)
            Initialize.click.setVolume(0);
        } else {
            Initialize.music.setVolume(0.4);
            Initialize.bigCheer.setVolume(0.4)
            Initialize.smallCheer.setVolume(0.4)
            Initialize.mediumCheer.setVolume(0.4)
            Initialize.click.setVolume(0.4);
        }
    }
});

let distances = [];

const getMenuCoords = () => {
    if (checkMapCollision(pos, Initialize.menuButton)){
        App.scoreboardDiv.style.display = 'none';
        if (Locations.text2)
            Locations.text2.style.display = 'none';
        App.setGameState("loading done");
        if (!highscoresButton) highscoresButton = highscoresButton;
        Initialize.setBackground(2);
        // Initialize.setMusic(0);
        clearScreen();
        scene.add(Initialize.highscoresButton);
        Initialize.scene.add(Initialize.title);
        if (newHighscore) {
            if (document.body.contains(newHighscore))
                document.body.removeChild(newHighscore);
            newHighscore = null;
        }
        hideHTMLScoreboard();
        scene.add(Initialize.startButton);
    }
}

const getHighscoresButtonCoords = () => {
    if (checkMapCollision(pos, Initialize.highscoresButton)){
        App.setGameState("loading done");
        clearScreen();
        scene.add(Initialize.menuButton);
        App.getScores();
        Initialize.menuButton.position.y = -900;
    }
}

let newHighscore;
let inputBar;
let submitButton2;
let header;

const getSubmitCoords = () => {
    if (checkMapCollision(pos, submitButton)){
        if (!newHighscore){
            // if (newHighscore)
                // document.body.removeChild(document.getElementById('highscoreDiv'));
            let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 1.5) / 2 + 'px';
            newHighscore = document.createElement('div');
            inputBar = document.createElement('input');
            submitButton2 = document.createElement('button');
            header = document.createElement('h3');
            inputBar.type = 'text';
            inputBar.name = 'submit';
            inputBar.id = 'nameInput';
            header.id = 'header';
            header.style.textAlign = 'center';
            inputBar.placeholder = 'Name';
            inputBar.align = 'right';
            inputBar.maxLength = 15;
            submitButton2.innerHTML = 'Submit';
            submitButton2.id = 'submitButton';
            submitButton2.style.align = 'center';
            submitButton2.style.width = window.innerHeight / 2.5 + 'px';
            submitButton2.style.marginTop = 5 + 'px';
            newHighscore.id = 'highscoreDiv';
            newHighscore.style.position = 'absolute';
            newHighscore.style.textAlign = 'center';
            newHighscore.style.paddingBottom = '10px';
            //newHighscore.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
            newHighscore.style.width = window.innerHeight/25 + '%';
            document.body.appendChild(newHighscore);
            let width = document.getElementById('highscoreDiv').clientWidth;
            newHighscore.style.backgroundColor = 'rgba(255,255,0)';
            newHighscore.style.borderRadius = window.innerHeight/20 + 'px';
            newHighscore.style.paddingLeft = window.innerHeight/78 + 'px';
            newHighscore.style.paddingRight = window.innerHeight/78 + 'px';
            header.innerHTML = "Score: " + totalPoints;
            newHighscore.style.top = 2 + 'px';
            //console.log(window.innerWidth/2 - width/2);
            newHighscore.style.left = window.innerWidth/2 - width/2 + 'px';
            newHighscore.appendChild(header);
            newHighscore.appendChild(inputBar);
            newHighscore.appendChild(submitButton2);
            submitButton2.addEventListener('click', function(){
                let name = encodeHTML(document.getElementById('nameInput').value);
                if (name.length > 0){
                    App.submitScore(name, totalPoints);
                    submitButton2.style.display = 'none';
                    inputBar.style.display = 'none';
                    // header.style.margin: 'auto';
                    let header2 = document.createElement('h4');
                    header2.id = 'submittedMessage';
                    header2.innerHTML = "Submitted";
                    newHighscore.appendChild(header2);
                    newHighscore.style.display= 'none';
                    // document.body.removeChild(newHighscore);
                } else alert('Name must be more than 0 characters');
                // alert('Thank you! Your highscore has been submitted');
            });
        }
    }
}

const getMapCoords = () => {
    if (!bg) bg = Initialize.background; //bg image
    let mapPos = new THREE.Vector3(); //blank v3
    mapPos.set(bg.position.x, bg.position.y, bg.position.z); //store the position of the map. it may be offset from screen coords a bit
    let width = bg.geometry.parameters.width; //help locate mouse in relation to map
    let height = bg.geometry.parameters.height; // same
    if (checkMapCollision(pos, bg)){ //only do stuff if mouse is over map, otherwise do nothging. so that user can click on side of screena nds tuff
        let tmp = new THREE.Vector3(); //temporary vluae
        tmp.set(pos.x, pos.y, pos.z); //set tmp to pos of mouse. pos is global variable that is set by getMousePos
        tmp.sub(mapPos);   
        convertToLatLong(tmp);
        distanceFromPoint = calculateScore(tmp.x, tmp.y, currentCity.latLong.x, currentCity.latLong.y);
        guessLat = tmp.y.toFixed(2);
        guessLong = tmp.x.toFixed(2);
        answerLat = currentCity.latLong.y.toFixed(2);
        answerLong = currentCity.latLong.x.toFixed(2);
        // (pos, tmp, convertLatLongToWorldCoords(tmp));
        let cityPosition = new THREE.Vector3();
        cityPosition.set(currentCity.latLong.x, currentCity.latLong.y, 0);
        let wrldCrds = convertLatLongToWorldCoords(cityPosition);
        let tmpPos = new THREE.Vector3(pos.x, pos.y, pos.z);

        //anti-meridian (example: hawaii to sydney the short way is wrapping around the edge of the map to get circle diameter/distance)
        let antiMeridianWest = new THREE.Vector3(-180, currentCity.latLong.y, 0);
        let antiMeridianEast = new THREE.Vector3(179, currentCity.latLong.y, 0)
        antiMeridianWest = convertLatLongToWorldCoords(antiMeridianWest);
        antiMeridianEast = convertLatLongToWorldCoords(antiMeridianEast);
        let diff = 0;
        let secondCirclePos = new THREE.Vector3(0,wrldCrds.y,0);
        if (wrldCrds.x < 0) {
            diff = Math.abs(antiMeridianWest.x - wrldCrds.x);
            secondCirclePos.x = antiMeridianEast.x + diff;
        } else {
            diff = Math.abs(antiMeridianEast.x - wrldCrds.x);
            secondCirclePos.x = antiMeridianWest.x - diff;
        }    

        // tmpPos.x -= 45;
        // tmpPos.y += 45;
        let distance = wrldCrds.distanceTo(tmpPos);
        let positionText = pos.x + ", " + pos.y;
        let antiDist = secondCirclePos.distanceTo(tmpPos);
        if (antiDist < distance){
            distances = [antiDist, distanceFromPoint];
        } else {
            distances = [distance, distanceFromPoint];
        }

        elapsedTime = 0;
        makeCircle(distance, cityPosition);
        twoCircles = false;
        if (antiDist < distance){
            makeOtherCircle(antiDist, secondCirclePos);
            twoCircles = true;
        }
        
        // //console.log("position of mouse: " + positionText);
        // //console.log("position of city: " + wrldCrds.x + ", " + wrldCrds.y);
        // //console.log("distance: " + distance);
        App.setGameState("animation");
        // window.clearTimeout(myTimer);
        // showScore(distance, distanceFromPoint);
    }
}
//Suva,"Suva","-18.1330","178.4417","Fiji","FJ","FJI","Rewa","primary","175399","1242615095"            

// const getAntiPosition = (wrldCrds, firstCircle) => {
//     console.log(currentCity.latLong.x);
//     let antiMeridianWest = new THREE.Vector3(currentCity.latLong.x, -180, 0);
//     console.log(antiMeridianWest);
//     let antiMeridianEast = new THREE.Vector3(currentCity.latLong.x, 180, 0);
//     antiMeridianWest = convertLatLongToWorldCoords(antiMeridianWest);
//     console.log(antiMeridianWest);
//     antiMeridianEast = convertLatLongToWorldCoords(antiMeridianEast);
//     let maximumX = antiMeridianEast.x;
//     let minimumX = antiMeridianWest.x;
//     if (firstCircle){
//         let result = new THREE.Vector3(maximumX + wrldCrds.x, wrldCrds.y, 0); //minimum is around -2500
//         console.log("result: " + result.x + " " + result.y);
//         return result;
//     } else {
//         return new THREE.Vector3(minimumX - ((maximumX - wrldCrds.x)), wrldCrds.y, 0);
//     }

// }

const getButtonCoords = () => {
    if (checkMapCollision(pos, button)){
        currentQuestion++;
        clearScreen();
        distanceFromPoint = 1000000;
        App.setGameState("during");
        // if (window.innerHeight/window.innerWidth > .55) {
            makeHTMLScoreboard();
        // } else {
            // makeMeshScoreboard();
        // }
        currentCity = Locations.getRandomLocation(numLocs[level]);
        // currentCity = Locations.getRandomLocation(1);
        App.resetTime();
    }
}

const getStartButtonCoords = () => {
    if (checkMapCollision(pos, startButton)){
        level = 0;
        Initialize.setBackground(mapIndex[level]);
        // Initialize.setMusic(musicIndex[level]);
        clearScreen();
        playerPoints = 0;
        totalPoints = 0;
        currentQuestion = 1;
        App.setGameState("during");
        highScore.innerHTML = "Highscore: " + App.checkCookie() + " Current: " + totalPoints;
        currentCity = Locations.getRandomLocation(numLocs[level]);
        // currentCity = Locations.getRandomLocation(1);
        // if (window.innerHeight/window.innerWidth > .55) {
            makeHTMLScoreboard();
        // } else {
            // makeMeshScoreboard();
        // }
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
        totalPoints = 0;
        currentQuestion = 1;
        if (newHighscore) {
            if (document.body.contains(newHighscore))
                document.body.removeChild(newHighscore);
            newHighscore = null;
        }
        currentCity = Locations.getRandomLocation(numLocs[level]);
        // currentCity = Locations.getRandomLocation(1);
        // if (window.innerHeight/window.innerWidth > .55) {
            // makeMeshScoreboard();
        // } else {
            makeHTMLScoreboard();
        // }
        App.resetTime();
    }
}


export const showScore = (distance, distanceMi) => {
    if (!distance) distance = 10000;
    if (!distanceMi) distanceMi = 10000;
    if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
    if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
    if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
    if (distanceMi < 50){
        if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
        playSound(Initialize.bigCheer);//.play();
    } else if (distanceMi < 250) {
        if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
        playSound(Initialize.mediumCheer);//.play();
    } else if (distanceMi < 10000) {
        //Do nothing
    } else {
        if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
        playSound(Initialize.smallCheer);//.play();
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
    totalPoints += resultPoints;
    App.setGameState("after");// = "after";
    makeHTMLScoreboard();
    // makeMeshScoreboard();
    if (currentQuestion == questions[level]) {
        if (levels[level] <= playerPoints){
            let levelWin = false;
            if (level == 9) levelWin = true 
            else level++;
            // Initialize.setMusic(musicIndex[level]);
            if (levelWin) {
                App.setGameState("game over");// = "game over";
                if (App.checkCookie() < totalPoints) App.setCookie("data", totalPoints, 365);
                // makeMeshScoreboard();
                makeHTMLScoreboard();
                level = 0;
                showGameOver("win");
                return;
            }
            currentQuestion = 0;
            playerPoints = 0;
            Initialize.setBackground(mapIndex[level]);
        } else {
            App.setGameState("game over");// = "game over";
            if (App.checkCookie() < totalPoints) App.setCookie("data", totalPoints, 365);
            // makeMeshScoreboard();
            makeHTMLScoreboard();
            showGameOver("lose");
            return;
        }
    }
    if (!button) button = Initialize.button;
    scene.add(button);
}

function encodeHTML(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const getLeft = (num) => {
    // if (window.innerHeight/window.innerWidth > .55){
    //     return '0px';
    // }
    let offset = Utils.getWindowOffset();
    if (num){
        offset = offset.replace("px", "");
        offset = offset + num;
        offset = offset + "px";
    }
    return offset
    //return ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';
}

export const getTop = (num, msg) => {
    // if (window.innerHeight/window.innerWidth > .55) {
    //     // let w = window.innerWidth * .55;
    //     // let top = null;
    //     // if (num == 14) { //timer bar bar
    //     //     top = w-(w * .27);
    //     // } else if (num == 7) { //level text
    //     //     top = w-(w * .31);
    //     // } else if (num == -28) { //goal text
    //     //     top = w-(w * .3);
    //     // } else if (num == -14) { //results points text?
    //     //     top = w-(w * .9);
    //     // } else if (num == 9.25) { //questions text
    //     //     top = w-(w * .29);
    //     // } else if (num == 28) { //timer bar
    //     //     top = w-(w * .35);
    //     // } else if (num == 0) { // location
    //     //     top = w-(w * .37); 
    //     // }
    //     // return top + 'px';
    //     if (num == 0) return (window.innerWidth * .55) / 2 + 'px';
    //     else if (num < 0) return (window.innerWidth * .55) / 2 - (window.innerWidth * .55)/num + 'px';
    //     return (window.innerWidth * .55) / 2 + (window.innerWidth * .55)/num + 'px';
    // }
    return window.innerHeight / 2 - window.innerHeight/num + 'px'; //+40
}

let fontSize = Utils.getFontSize();

//28 14 9.25 
let left = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';
let playerPointsText = document.createElement('div');
playerPointsText.className = 'hover';
playerPointsText.style.id = 'playerPointsText';
playerPointsText.style.position = 'absolute';
playerPointsText.style.display = 'none';
playerPointsText.style.width = 100;
playerPointsText.style.height = 100;
playerPointsText.style.color = 'black';
playerPointsText.style.backgroundColor = "green";
// playerPointsText.style.backgroundColor = "rgb(f,f,f,.3)";
// if (window.innerHeight/window.innerWidth > .55) {
//     playerPointsText.style.top = getTop(3.5, 'weird bug e');
// } else {
    playerPointsText.style.top = getTop(14, 'casm');
// }
playerPointsText.style.fontSize = fontSize;
playerPointsText.style.left = getLeft();
document.body.appendChild(playerPointsText);
let questionsText = document.createElement('div');
questionsText.className = 'hover';
questionsText.style.position = 'absolute';
questionsText.style.display = 'none';
questionsText.style.width = 100;
questionsText.style.height = 100;
questionsText.style.color = "black";
questionsText.style.backgroundColor = "green";
// questionsText.style.backgroundColor = "rgb(f,f,f,.3)";
// if (window.innerHeight/window.innerWidth > .55) {
//     questionsText.style.top = getTop(7, "nbnbnb");
// } else {
    questionsText.style.top = getTop(9.25);
// }


questionsText.style.left = getLeft();
questionsText.style.fontSize = fontSize;
document.body.appendChild(questionsText);
let levelText = document.createElement('div');
levelText.className = 'hover';
levelText.style.position = 'absolute';
levelText.style.position = 'none';
levelText.style.width = 100;
levelText.style.height = 100;
levelText.style.color = 'black';
levelText.style.backgroundColor = "green";
// levelText.style.backgroundColor = "rgb(f,f,f,.3)";
// if (window.innerHeight/window.innerWidth > .55) {
//     levelText.style.top = getTop(9.25, "00");
// } else {
    levelText.style.top = getTop(7);
// }
// if (window.innerWidth-4/window.innerHeight-4 > .55) {
//     levelText.style.left = 10 + 'px';
// } else 
levelText.style.left = getLeft();
levelText.style.fontSize = fontSize;
document.body.appendChild(levelText);
let resultText;
resultText = document.createElement('div');
resultText.className = 'hover';
resultText.style.position = 'absolute';
resultText.style.display = 'none';
resultText.style.width = 100;
resultText.style.height = 100;
resultText.style.color = 'black';
resultText.style.backgroundColor = "yellow";
resultText.style.top = getTop(-40);
resultText.style.left = innerWidth / 2 + 'px';
resultText.style.fontSize = fontSize;
document.body.appendChild(resultText);
let resultPointsText = document.createElement('div');
resultPointsText.className = 'hover';
resultPointsText.style.position = 'absolute';
resultPointsText.style.display = 'none';
resultPointsText.style.width = 100;
resultPointsText.style.height = 100;
resultPointsText.style.color = 'black';
resultPointsText.style.backgroundColor = "yellow";
resultPointsText.style.top = getTop(-14);
resultPointsText.style.left = innerWidth / 2 + 'px';
resultPointsText.style.fontSize = fontSize;
document.body.appendChild(resultPointsText);
let goalText = document.createElement('div');
goalText.className = 'hover';
goalText.style.position = 'absolute';
goalText.style.display = 'none';
goalText.style.backgroundColor = "green";
// goalText.style.backgroundColor = "rgb(f,f,f,.3)";
goalText.style.top = window.innerHeight / 2 + 'px';
goalText.style.left = innerWidth / 2 + 'px';
goalText.style.fontSize = fontSize;
goalText.style.top = getTop(9.25);
// document.body.appendChild(goalText);
let progressBar = document.createElement('div');
progressBar.className = 'hover';
progressBar.style.display = 'none';
progressBar.style.position = 'absolute';
let progressBarBorder = document.createElement('div');
let highScore = document.createElement('div');
// if (window.innerHeight/window.innerWidth > .55){
//     progressBar.style.height = (window.innerWidth*.55)/40 + "px";
//     progressBar.style.top = (window.innerWidth*.55) / 2 - (window.innerWidth*.55)/28 + 'px'; //+40
//     progressBar.style.width = ((window.innerWidth*.55)/4.25) * (playerPoints/levels[level]) + "px";
//     progressBarBorder.style.height = (window.innerWidth*.55)/40 + "px";
//     progressBarBorder.style.width = ((window.innerWidth*.55)/4.5) + "px";
//     highScore.style.top = (window.innerWidth - (window.innerWidth * .62)) + 'px';
// } else {
    progressBar.style.height = window.innerHeight/40 + "px";
    progressBar.style.top = ((window.innerHeight / 2 - window.innerHeight/28) + 1) + 'px'; //+40
    progressBar.style.width = (window.innerHeight/4.25) * (playerPoints/levels[level]) + "px";
    progressBarBorder.style.height = window.innerHeight/40 + "px";
    progressBarBorder.style.width = (window.innerHeight/4.25) + "px";
    highScore.style.top = 0 + 'px';
// }
progressBar.style.backgroundColor = "green";
// progressBar.style.backgroundColor = "rgb(f,f,f,.3)";
progressBar.style.left = getLeft();//window.innerHeight/57.5 + 'px';

progressBarBorder.style.display = 'none';
progressBarBorder.style.position = 'absolute';
progressBarBorder.style.border = 'solid green 0.1px';
progressBarBorder.style.top = getTop(28); //+40
progressBarBorder.style.left = getLeft();//window.innerHeight/57.5 + 'px';
document.body.appendChild(progressBarBorder);
document.body.appendChild(progressBar);

highScore.className = 'hover';
highScore.style.display = 'none';
highScore.style.position = 'absolute';
highScore.style.backgroundColor = "yellow";

highScore.style.left = getLeft();
highScore.style.fontSize = fontSize;
document.body.appendChild(highScore);
// let mouseposText = document.createElement('div');
// let cityposText = document.createElement('div');
// let distanceText = document.createElement('div');
// document.body.appendChild(mouseposText);
// document.body.appendChild(cityposText);
// document.body.appendChild(distanceText);

// mouseposText.innerHTML = "new VgetMousePos";

const hideHTMLScoreboard = () => {
    playerPointsText.style.display = 'none';
    questionsText.style.display = 'none';
    levelText.style.display = 'none';
    resultText.style.display = 'none';
    resultPointsText.style.display = 'none';
    goalText.style.display = 'none';
    progressBar.style.display = 'none';
    progressBarBorder.style.display = 'none';
    highScore.style.display = 'none';
}

export const restyleHTML = (offset) => {
    let left = offset;//window.innerHeight/57.5 + 'px';
    // else if (App.getGameState() == "after") left = window.innerWidth/2 + 'px';
    //playerPointsText.style.position = 'absolute';
    // playerPointsText.style.width = 100;
    // playerPointsText.style.height = 100;
    // playerPointsText.style.backgroundColor = "green";
    // playerPointsText.style.backgroundColor = "rgb(f,f,f,.3)";
    //playerPointsText.style.top = getTop(9.25);//window.innerHeight / 2 - window.innerHeight/14 + 'px';
    //playerPointsText.style.fontSize = fontSize;
    playerPointsText.style.left = getLeft();
    // questionsText.style.position = 'absolute';
    // questionsText.style.width = 100;
    // questionsText.style.height = 100;
    // questionsText.style.backgroundColor = "green";
    // questionsText.style.backgroundColor = "rgb(f,f,f,.3)";
    // questionsText.style.top = getTop(7);//window.innerHeight / 2 - window.innerHeight / 9.25 + 'px';
    questionsText.style.left = getLeft();
    //questionsText.style.fontSize = fontSize;
    // levelText.style.position = 'absolute';
    // levelText.style.width = 100;
    // levelText.style.height = 100;//window.innerHeight/40 + "px";
    // levelText.style.backgroundColor = "green";
    // levelText.style.backgroundColor = "rgb(f,f,f,.3)";
    // if (window.innerHeight/window.innerWidth > .55) {
    //     levelText.style.top = getTop(5);
    // } else {
        //levelText.style.top = window.innerHeight / 2 - window.innerHeight / 5 + 'px';
    // }
    levelText.style.left = getLeft();
    //levelText.style.fontSize = fontSize;
    progressBar.style.height = 100;//window.innerHeight/40 + "px";
    //progressBar.style.top = window.innerHeight / 2 - window.innerHeight/28 + 'px'; //+40
    progressBar.style.left = getLeft(2);//window.innerHeight/57.5 + 'px';
    //progressBar.style.width = (window.innerHeight/4.25) * (playerPoints/levels[level]) + "px";
    progressBarBorder.style.height = 100;//window.innerHeight/40 + "px";
    //progressBarBorder.style.top = window.innerHeight / 2 - window.innerHeight/28 + 'px'; //+40
    progressBarBorder.style.left = getLeft();//window.innerHeight/57.5 + 'px';
    //progressBarBorder.style.width = (window.innerHeight/4.5) + "px";
    //highScore.style.position = 'absolute';
    //highScore.style.backgroundColor = "yellow";
    //highScore.style.top = 0 + 'px';
    highScore.style.left = getLeft();
    //highScore.style.fontSize = fontSize;
    if (!resultText)
        resultText = document.createElement('div');
    resultText.style.position = 'absolute';
    resultText.style.width = 100;
    resultText.style.height = 100;
    resultText.style.backgroundColor = "yellow";
    //resultText.style.top = window.innerHeight / 2 + window.innerHeight / 28 + 'px';
    if (App.getGameState() == 'game over')
        resultText.style.left = window.innerWidth / 2 + window.innerWidth/4 + 'px';
    else
        resultText.style.left = window.innerWidth / 2 + 'px';
    //resultText.style.fontSize = fontSize;
    if (!goalText)
        goalText = document.createElement('div');
    goalText.style.position = 'absolute';
    goalText.style.color = "green";
    goalText.style.top = window.innerHeight / 2 + 'px';
    if (App.getGameState() == 'game over')
        goalText.style.left = window.innerWidth / 2 + window.innerWidth/4 + 'px';
    else
        goalText.style.left = window.innerWidth / 2 + 'px';
    //goalText.style.fontSize = fontSize;
    goalText.style.top = window.innerHeight / 2 + window.innerHeight / 9.25 + 'px';
    if (!resultPointsText)
        resultPointsText = document.createElement('div');
    resultPointsText.style.position = 'absolute';
    resultPointsText.style.width = 100;
    resultPointsText.style.height = 100;
    resultPointsText.style.background = "yellow";
    resultPointsText.style.top = getTop(14);
    if (App.getGameState() == "game over")
        resultPointsText.style.left = window.innerWidth / 2 + 'px';
    else
        resultPointsText.style.left = window.innerWidth / 2 + 'px';
    //resultPointsText.style.fontSize = fontSize;
}

let questionsText2 = null;
let levelText2 = null;
let resultText2 = null;
let resultPointsText2 = null;
let goalText2 = null;
let highScore2 = null;
let locationText2 = null;
let locationText3 = null;

export const makeMeshScoreboard = (distance) => {
    // if (questionsText2 != null) {
    //     scene.remove(questionsText2);
    //     scene.remove(levelText2);
    //     scene.remove(resultText2);
    //     scene.remove(goalText2);
    //     scene.remove(highScore2);
    // }
    // const fontJson = require( '../fonts/Arial_regular.json' );
    // const font = new THREE.Font( fontJson );
    // let fontInfo = {
    //     font: font,
    //     size: 70,
    //     height: 0,
    //     curveSegments: 2,
    //     bevelThickness: 1,
    //     bevelSize: 1,
    //     bevelEnabled: false
    // };

    // questionsText2 = new THREE.TextGeometry( "Question: " + currentQuestion + "/" + questions[level], fontInfo);
    // levelText2 = new THREE.TextGeometry( "Level " + (level + 1) + ": Top " + numLocs[level] + " Cities", fontInfo);
    // if (distanceFromPoint >= 100000) {
    //     resultText2 = new THREE.TextGeometry( "Result: Out of Time", fontInfo );
    // } else {
    //     resultText2 = new THREE.TextGeometry( "Result: " + distanceFromPoint + " mi." , fontInfo);
    // }
    // resultPointsText2 = new THREE.TextGeometry(  "Points: " + resultPoints, fontInfo);
    // goalText2 = new THREE.TextGeometry( "Question: " + currentQuestion + "/" + questions[level], fontInfo);
    // highScore2 = new THREE.TextGeometry( "Highscore: " + App.checkCookie() + " Current: " + totalPoints, fontInfo);
    // // currentCity = Locations.getLocationText(numLocs[level]);
    // if (currentCity.secondary.length == 0) {
    //     locationText2 = new THREE.TextGeometry( currentCity.city, fontInfo);
    //     locationText3 = new THREE.TextGeometry( currentCity.secondary, fontInfo);
    // } else {
    //     locationText2 = new THREE.TextGeometry( currentCity.city + ", " + currentCity.secondary, fontInfo);
    //     locationText3 = new THREE.TextGeometry( currentCity.country, fontInfo);
    // }
    // // var textGeometry = new THREE.TextGeometry( );
    // // let meshes = [questionsText2, levelText2, resultText2, goalText2, highScore2];

    // var textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, specular: 0xffffff });
    // getTextMesh(-2000, 100, questionsText2, new THREE.MeshBasicMaterial({ color: 0x009900, specular: 0xffffff }));
    // getTextMesh(-2000, -100, resultText2, new THREE.MeshBasicMaterial({ color: 0xffff00, specular: 0xffffff }));
    // getTextMesh(-2000, 0, levelText2, new THREE.MeshBasicMaterial({ color: 0x009900, specular: 0xffffff }));
    // getTextMesh(0, 0, resultPointsText2, new THREE.MeshBasicMaterial({ color: 0xffff00, specular: 0xffffff }));
    // getTextMesh(-2000, 1000, highScore2, new THREE.MeshBasicMaterial({ color: 0xffff00, specular: 0xffffff }));
    // getTextMesh(-2000, 300, locationText2, new THREE.MeshBasicMaterial({ color: 0x0000ff, specular: 0xffffff }));
    // getTextMesh(-2000, 200, locationText3, new THREE.MeshBasicMaterial({ color: 0x0000ff, specular: 0xffffff }));
}

const getTextMesh = (x, y, mesh, tm) => {
    mesh = new THREE.Mesh( mesh, tm );
    scene.add( mesh );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = 4;
}

export const makeHTMLScoreboard = (distance) => {

    //let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';
    Utils.getWindowOffset();
    let left;
    if (App.getGameState() == "during") left = windowOffset; //window.innerHeight/57.5 + 'px';
    else if (App.getGameState() == "after") left = innerWidth/2 + 'px';
    if (playerPointsText.style.display == 'none'){
        playerPointsText.style.display = 'inline-block';
    }
    let pp = playerPoints;
    if (pp >= levels[level]) pp = levels[level];
    playerPointsText.innerHTML = "Goal: " + pp + "/" + levels[level];

    if (questionsText.style.display == 'none'){
        questionsText.style.display = 'inline-block';
    }
    questionsText.innerHTML = "Question: " + currentQuestion + "/" + questions[level];

    if (levelText.style.display = 'none'){
        levelText.style.display = 'inline-block';
    }
    levelText.innerHTML = "Level " + (level + 1) + ": Top " + numLocs[level] + " Cities";

    if (progressBar.style.display = 'none'){
        progressBarBorder.style.display = 'inline-block';
        progressBar.style.display = 'inline-block';
    }
    let progressPercentage = playerPoints/levels[level];
    if (progressPercentage > 1) progressPercentage = 1;
    progressBar.style.width = window.innerHeight/4.25 * progressPercentage + 'px';

    if (App.getGameState() == 'after' || App.getGameState() =="game over"){
        resultText.style.display = "inline-block";
        if (distanceFromPoint >= 100000) resultText.innerHTML = "Result: Out of Time";
        else resultText.innerHTML = "Result: " + distanceFromPoint + " miles";
    } else if (resultText) resultText.style.display = "none";
    
    if (App.getGameState() == 'after' || App.getGameState() == "game over"){
        resultPointsText.style.display = "inline-block";
        resultPointsText.innerHTML = "Points: " + resultPoints + "<br> Your Guess: " + getLatLongForDisplay(guessLat, guessLong) + "<br> Answer:&nbsp&nbsp&nbsp&nbsp " + getLatLongForDisplay(answerLat, answerLong) ;
    } else if (resultPointsText) resultPointsText.style.display = "none";

    if (App.getGameState() == 'after'){
        goalText.style.display = "inline-block";
        if (playerPoints >= levels[level])
            goalText.innerHTML = "Progress: Completed, " + currentQuestion + "/" + questions[level] + " questions";
        else
            goalText.innerHTML = "Progress: " + playerPoints + "/" + levels[level] + ", " + currentQuestion + "/" + questions[level] + " questions";
    } else if (goalText) goalText.style.display = "none";
    if (App.getGameState() == 'during' || App.getGameState() == 'after'){
        highScore.style.display = 'inline-block';
    }
    highScore.innerHTML = "Highscore: " + App.checkCookie() + " Current: " + totalPoints;
}

const getLatLongForDisplay = (lat, long) => {
    return getDMS(lat, true) + ", " + getDMS(long, false);
}

const getDMS = (num, isLat) => {
    num = (Math.round(num * 10000)) / 10000; //round to ten thou

// The whole number is degrees. So 156.742 gives you 156 degrees.
// Multiply the remaining decimal by 60.
// 0.742*60 = 44.52, so the whole number 44 equals minutes.
// Multiply the remaining decimal by 60.
// 0.52*60 = 31.2, so the whole number 31 equals seconds.
// Decimal degrees 156.742 converts to 156 degrees, 44 minutes and 31 seconds, or 156° 44' 31".
// Be sure to follow math rules of rounding when calculating seconds by hand. If your resulting seconds is something like 31.9 you may round up to 32.

    //N
  //W   E
    //S    
    let dir = "N";

    let degreeSymbol = "°";
    let minutesSymbol = "\'"
    let secondsSymbol = "\"";

    //weird and confusing way to do this, but ok.
    let tmp = getDegrees(num);
    let degs = tmp[0];
    tmp = getMinutes(tmp[1]);
    let mins = tmp[0];
    let secs = getSeconds(tmp[1]);

    if (isLat){
        if (degs < 0) {
            dir = "S";
        }
    } else {
        if (degs < 0) {
            dir = "W";
        } else {
            dir = "E";
        }
    }

    degs = Math.abs(degs);
    mins = Math.abs(mins);
    secs = Math.abs(secs);

    degs = padNumber(degs);
    mins = padNumber(mins);
    secs = padNumber(secs);

    return dir + degs + degreeSymbol + mins + minutesSymbol + secs + secondsSymbol;
    

}

const padNumber = (num) => {
    if (num < 10) return "0"+num;
    else return num;
}


const getDegrees = (degs) => {
    //modify num and return the decimal seconds portion
    //example: 50.11 is 50 degrees and return .11 to be converted to minutes
    let tmp = degs;
    degs = Math.round(degs);
    tmp =  Math.abs(tmp - degs);
    tmp = (Math.round(tmp * 100)) / 100; //round to hund
    return [degs,tmp];
}

const getMinutes = (mins) => {
    mins = mins * 60;
    let tmp = mins;
    mins = Math.round(mins);
    tmp = Math.abs(tmp - mins);
    tmp = (Math.round(tmp * 100)) / 100; //round to hund
    return [mins,tmp];
}

const getSeconds = (secs) => {
    secs = secs * 60;
    secs = Math.round(secs);
    return secs;
}

//This would be good if it was mercator... its gall peters!!!
// const getScaleFactor = (degreesGuess, degreesAnswer) => {
//     //average scale factor, S = (S1 + 4 Sm + S2) / 6
//     let difference = Math.abs(degreesGuess - degreesAnswer);

//     let s1 = 1/Math.cos(toRadians(degreesGuess));
//     let s2 = 1/Math.cos(toRadians(degreesAnswer));
//     let middle = Math.min(degreesGuess, degreesAnswer) + difference/2
//     let sm = 1/Math.cos(middle);

//     let s = Math.abs((s1 + 4 * sm + s2) / 6);

//     return s;

// }

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
    goalText.style.left = window.innerWidth / 2 + window.innerWidth/14 + 'px';
    resultPointsText.style.left = window.innerWidth / 2 + window.innerWidth/14 + 'px';
    resultText.style.left = window.innerWidth / 2 + window.innerWidth/14 + 'px';
    if (result == "win") {
        if (!winButton) winButton = Initialize.winButton;
        Initialize.scene.add(winButton);
        playSound(Initialize.bigCheer);
    }
    if (result == "lose") {
        if (!gameOverButton) gameOverButton = Initialize.gameoverButton;
        Initialize.scene.add(gameOverButton);
        playSound(Initialize.smallCheer);
    }
    if (!restartButton) restartButton = Initialize.restartButton;
    Initialize.scene.add(restartButton);
    if (!menuButton) menuButton = Initialize.menuButton;
    menuButton.position.y = window.innerHeight/2 - 800;
    Initialize.scene.add(menuButton);
    if (!submitButton) submitButton = Initialize.submitButton;
    if (App.checkCookie() == totalPoints) {
        Initialize.scene.add(submitButton);
        resultText.innerHTML = "New Highscore! <br> " + resultText.innerHTML;
    }
}

const clearScreen = () => {
    scene.remove.apply(scene, scene.children);
    App.render();
    Initialize.init();
}

export const updateCircleRadius = () => {
    if (circleStart == 0) { 
        currentTime = new Date().getTime();
        circleProgress = 0;
        let distance = distances[0];
        let distanceMi = distances[1];
        if (!distance) distance = 10000;
        if (!distanceMi) distanceMi = 10000;
        if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
        if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
        if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
        if (distanceMi < 25){
            if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
            playSound(Initialize.bigCheer);//.play();
        } else if (distanceMi < 100) {
            if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
            playSound(Initialize.mediumCheer);//.play();
        } else if (distanceMi < 10000) {
            //Do nothing
            if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
            playSound(Initialize.smallCheer);//.play();
        } else {
            // if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
            // playSound(Initialize.smallCheer);//.play();
        }
    }
     circleStart = 1;
     if (twoCircles){
        updateCircleRadius2();
     } else {
        updateCircleRadius3();
     }
     // animateCircleRadius(true);
     // animateCircleRadius(false);
   
}

export const updateCircleRadius3 = () => {
    if (circleStart == 0) { 
        let distance = distances[0];
        let distanceMi = distances[1];
        if (!distance) distance = 10000;
        if (!distanceMi) distanceMi = 10000;
        if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
        if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
        if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
        if (distanceMi < 25){
            if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
            playSound(Initialize.bigCheer);//.play();
        } else if (distanceMi < 100) {
            if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
            playSound(Initialize.mediumCheer);//.play();
        } else if (distanceMi < 10000) {
            //Do nothing
        } else {
            if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
            playSound(Initialize.smallCheer);//.play();
        }
    }
    circleStart = 1;

    let tmpTime = new Date().getTime();
    // console.log("current " + currentTime);
    // console.log("tmp " + tmpTime);
    elapsedTime = tmpTime - currentTime;
    currentTime = new Date().getTime();
    let dist = elapsedTime * circleSpeed;
    circleProgress += dist;
    circleProgress = Math.abs(circleProgress);
    // console.log("elapsed: " + elapsedTime);
    // console.log("dist: " + dist);

    if (circleProgress > distances[0]) dist = distances[0];

    circle.scale.set(circleProgress, circleProgress, 1);
    scene.remove(circle3);
    let geometry = new THREE.RingGeometry( circle.scale.x-7, circle.scale.x, Math.round(distances[0]) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    circle3 = new THREE.Mesh( geometry, material );
    circle3.position.set(circle.position.x, circle.position.y, 1);
    scene.add(circle3);
    if (circle.scale.x >= distances[0]) {
        circleStart = 0;
        circle.scale.set(distances[0], distances[0], 1);
        scene.remove(circle3);
        let geometry = new THREE.RingGeometry( circle.scale.x-7, circle.scale.x, Math.round(distances[0]) );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
        circle3 = new THREE.Mesh( geometry, material );
        circle3.position.set(circle.position.x, circle.position.y, 1);
        scene.add(circle3);
        showScore(distances[0], distances[1]);
    }
}

export const updateCircleRadius2 = () => {
    if (circleStart == 0) { 
        let distance = distances[0];
        let distanceMi = distances[1];
        if (!distance) distance = 10000;
        if (!distanceMi) distanceMi = 10000;
        if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
        if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
        if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
        if (distanceMi < 25){
            if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
            playSound(Initialize.bigCheer);//.play();
        } else if (distanceMi < 100) {
            if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
            playSound(Initialize.mediumCheer);//.play();
        } else if (distanceMi < 10000) {
            //Do nothing
        } else {
            if (Initialize.smallCheer.isPlaying) Initialize.smallCheer.stop();
            playSound(Initialize.smallCheer);//.play();
        }
    }
    circleStart = 1;

    let tmpTime = new Date().getTime();
    // console.log("current " + currentTime);
    // console.log("tmp " + tmpTime);
    elapsedTime = tmpTime - currentTime;
    currentTime = new Date().getTime();
    let dist = elapsedTime * circleSpeed;
    circleProgress += dist;

    // console.log("elapsed: " + elapsedTime);
    // console.log("dist: " + dist);

    if (Math.abs(circleProgress) > distances[0]) dist = distances[0];


    circle.scale.set(Math.abs(circleProgress), Math.abs(circleProgress), 1);
    circle4.scale.set(Math.abs(circleProgress), Math.abs(circleProgress), 1);
    // circle.scale.set(circle.scale.x + 10, circle.scale.y + 10, 1);
    scene.remove(circle3);
    scene.remove(circle5);
    let geometry = new THREE.RingGeometry( circle.scale.x-7, circle.scale.x, Math.round(distances[0]) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    circle3 = new THREE.Mesh( geometry, material );
    circle5 = new THREE.Mesh( geometry, material );
    circle3.position.set(circle.position.x, circle.position.y, 1);
    circle5.position.set(circle4.position.x, circle4.position.y, 1);
    scene.add(circle3);
    scene.add(circle5);
    if (circle.scale.x >= distances[0] || circle4.scale.x >= distances[0]) {
        circleStart = 0;
        circle.scale.set(distances[0], distances[0], 1);
        circle4.scale.set(distances[0], distances[0], 1);
        scene.remove(circle3);
        scene.remove(circle5);
        let geometry = new THREE.RingGeometry( circle.scale.x-7, circle.scale.x, Math.round(distances[0]) );
        let geometry2 = new THREE.RingGeometry( circle4.scale.x-7, circle4.scale.x, Math.round(distances[0]) );
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
        circle3 = new THREE.Mesh( geometry, material );
        circle5 = new THREE.Mesh( geometry2, material );
        circle3.position.set(circle.position.x, circle.position.y, 1);
        circle5.position.set(circle4.position.x, circle4.position.y, 1);
        scene.add(circle3);
        scene.add(circle5);
        showScore(distances[0], distances[1]);
    }
}


//circle is the green circle
//circle2 is the red dot
//circle3 is the green ring around circle
const makeCircle = (distance, position) => {
    let tmp = new THREE.Vector3(position.x, position.y, 0);
    tmp = convertLatLongToWorldCoords(tmp);
    // convertToPixelCoords(tmp);
    let geometry = new THREE.CircleGeometry( 1, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.2, transparent: true } );
    circle = new THREE.Mesh( geometry, material );
    circle.position.set(tmp.x, tmp.y, 2);
    scene.add( circle );
    geometry = new THREE.CircleGeometry( 8, 8 );
    if (mapIndex[level] == 3)
        material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    else
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
    var circle2 = new THREE.Mesh( geometry, material );
    circle2.position.set(tmp.x, tmp.y, 3);
    scene.add( circle2 );
    geometry = new THREE.RingGeometry( 0, 2, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    circle3 = new THREE.Mesh( geometry, material );
    circle3.position.set(tmp.x, tmp.y, 2);
    scene.add( circle3 );
}

const makeOtherCircle = (distance, position) => {
    let tmp = position;
    // convertToPixelCoords(tmp);
    let geometry = new THREE.CircleGeometry( 1, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.2, transparent: true } );
    circle4 = new THREE.Mesh( geometry, material );
    circle4.position.set(tmp.x, tmp.y, 2);
    scene.add( circle4 );
    geometry = new THREE.CircleGeometry( 8, 8 );
    if (mapIndex[level] == 3)
        material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    else
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
    var circle6 = new THREE.Mesh( geometry, material );
    circle6.position.set(tmp.x, tmp.y, 3);
    scene.add( circle6 );
    geometry = new THREE.RingGeometry( 0, 2, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    circle5 = new THREE.Mesh( geometry, material );
    circle5.position.set(tmp.x, tmp.y, 2);
    scene.add( circle5 );
}

const convertLatLongToWorldCoords = (vec) => {
    let tmp = new THREE.Vector3(vec.x, vec.y, 0);
    convertToPixelCoords(tmp);
    return tmp;
}

let conversionFactor = 13.88;

const convertToLatLong = (vec) => {
    vec.x += windowOffset;
    vec.y += windowOffsetY;
    vec.x /= conversionFactor;
    vec.y /= conversionFactor;
}

export const convertToPixelCoords = (vec) => {
    vec.x *= conversionFactor;
    vec.y *= conversionFactor;
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
export let currentCity;// = Locations.getRandomLocation();

// let portlandText = document.createElement('div');
// document.body.appendChild(portlandText);
// let loc = convertLatLongToWorldCoords(new THREE.Vector3(43.6591, -70.2568, 0));
// portlandText.innerHTML = "Portland: " +loc.x + ", " + loc.y;

const getMouseCoords = (event) => {
    mouse.clientX = event.clientX;
    mouse.clientY = event.clientY;
    // if (window.innerHeight/window.innerWidth > .55) {
    //     mouse.clientY += (renderer.domElement.height - window.innerHeight) / 2;
    //     //(mouse.clientY, event.clientY);
    // }
    // mouse.clientX -= windowOffset;
    // mouse.clientY -= windowOffsetY;
}

export const getMousePos = () => {
    let targetZ = 0;
    vec.set(
    ( mouse.clientX / renderer.domElement.width ) * 2 - 1,
    - ( mouse.clientY / renderer.domElement.height ) * 2 + 1,
    0.5 );
    vec.unproject( camera );
    vec.sub( camera.position ).normalize();
    let distance2 = ( targetZ - camera.position.z ) / vec.z;
    pos.copy( camera.position ).add( vec.multiplyScalar( distance2 ) );
        //why is this offset idk!.
    pos.x -= 35; 
    pos.y += 35;
 
//     pos.set(
//     (event.clientX / window.innerWidth) * 2 - 1,
//     - (event.clientY / window.innerHeight) * 2 + 1,
//     0
// );
// pos.unproject(camera);
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


