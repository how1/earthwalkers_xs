import * as THREE from 'three';
import * as Initialize from './Initialize.js';
import * as CollisionDetection from './CollisionDetection.js';
import * as Locations from './locations.js';
import * as App from '../app.js';
// var createGeometry = require('three-bmfont-text')
// var loadFont = require('load-bmfont')


let level = 0;
let time = 10000;
let timer = 0;
let playerPoints = 0;
let totalPoints = 0;
let distanceFromPoint = 10000000;
let resultPoints = 0;

export let myTimer;

let levels = [125, 200, 275, 300, 325, 415, 415, 415, 500, 580]; //580
let numLocs = [50, 100, 200, 500, 750, 1000, 5000, 5000, 10000, 15000];
let musicIndex = [0, 0, 1, 1, 0, 0, 0, 2, 2, 2];
let points = 100;
let questions = [3, 4, 5, 5, 5, 6, 6 , 6, 7, 8];
console.log(levels[0]/questions[0], levels[1]/questions[1], levels[2]/questions[2], levels[3]/questions[3], levels[4]/questions[4], levels[5]/questions[5], levels[6]/questions[6], levels[7]/questions[7], levels[8]/questions[8], levels[9]/questions[9]);
let mapIndex = [0, 0, 1, 1, 2, 2, 2, 3, 3, 3];
let maps = []
let currentQuestion = 1;

export let windowOffset = 110; //was 125
export let windowOffsetY = -20;

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
    if (App.getGameState() == "loading done"){
        Initialize.click.play();
        getStartButtonCoords();
        getHighscoresButtonCoords();
        getMenuCoords();
    }
    else if (App.getGameState() == "during"){
        Initialize.click.play()
        getMapCoords();
    }
    else if (App.getGameState() == "after"){
        Initialize.click.play();
        getButtonCoords();
    }
    else if (App.getGameState() == "game over"){
        Initialize.click.play();
        getRestartCoords();
        getMenuCoords();
        getSubmitCoords();
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
        console.log(Initialize.menuButton.position);
        App.getScores();
        Initialize.menuButton.position.y = -900;
        console.log(Initialize.menuButton.position);
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
            console.log(window.innerWidth/2 - width/2);
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

const getButtonCoords = () => {
    if (checkMapCollision(pos, button)){
        currentQuestion++;
        clearScreen();
        distanceFromPoint = 1000000;
        App.setGameState("during");
        // if (window.innerHeight/window.innerWidth > .55) {
            // makeHTMLScoreboard();
        // } else {
            makeMeshScoreboard();
        // }
        currentCity = Locations.getRandomLocation(numLocs[level]);
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
        // if (window.innerHeight/window.innerWidth > .55) {
        //     makeHTMLScoreboard();
        // } else {
            makeMeshScoreboard();
        // }
        App.resetTime();
    }
}


const getRestartCoords = () => {
    if (checkMapCollision(pos, restartButton)){
        level = 0;
        console.log(mapIndex[level]);
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
        // if (window.innerHeight/window.innerWidth > .55) {
            makeMeshScoreboard();
        // } else {
        //     // makeHTMLScoreboard();
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
    if (distance < 10){
        if (Initialize.bigCheer.isPlaying) Initialize.bigCheer.stop();
        Initialize.bigCheer.play();
    } else if (distance < 30) {
        if (Initialize.mediumCheer.isPlaying) Initialize.mediumCheer.stop();
        Initialize.mediumCheer.play();
    } else if (distance < 75) {
        //Do nothing
    } else {
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
    totalPoints += resultPoints;
    App.setGameState("after");// = "after";
    // makeHTMLScoreboard();
    makeMeshScoreboard();
    if (currentQuestion == questions[level]) {
        console.log("level over");
        if (levels[level] <= playerPoints){
            let levelWin = false;
            if (level == 9) levelWin = true 
            else level++;
            // Initialize.setMusic(musicIndex[level]);
            if (levelWin) {
                console.log("here");
                App.setGameState("game over");// = "game over";
                if (App.checkCookie() < totalPoints) App.setCookie("data", totalPoints, 365);
                makeMeshScoreboard();
                // makeHTMLScoreboard();
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
            makeMeshScoreboard();
            // makeHTMLScoreboard();
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
    if (window.innerHeight/window.innerWidth > .55){
        return '0px';
    }
    return ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';
}

export const getTop = (num, msg) => {
    console.log(num, msg);
    if (window.innerHeight/window.innerWidth > .55) {
        // let w = window.innerWidth * .55;
        // console.log('top', num);
        // let top = null;
        // if (num == 14) { //timer bar bar
        //     top = w-(w * .27);
        // } else if (num == 7) { //level text
        //     top = w-(w * .31);
        // } else if (num == -28) { //goal text
        //     top = w-(w * .3);
        // } else if (num == -14) { //results points text?
        //     top = w-(w * .9);
        // } else if (num == 9.25) { //questions text
        //     top = w-(w * .29);
        // } else if (num == 28) { //timer bar
        //     top = w-(w * .35);
        // } else if (num == 0) { // location
        //     top = w-(w * .37); 
        // }
        // return top + 'px';
        if (num == 0) return (window.innerWidth * .55) / 2 + 'px';
        else if (num < 0) return (window.innerWidth * .55) / 2 - (window.innerWidth * .55)/num + 'px';
        return (window.innerWidth * .55) / 2 + (window.innerWidth * .55)/num + 'px';
    }
    console.log('top2', num);
    return window.innerHeight / 2 - window.innerHeight/num + 'px'; //+40
}

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
if (window.innerHeight/window.innerWidth > .55) {
    playerPointsText.style.top = getTop(3.5, 'weird bug e');
} else {
    playerPointsText.style.top = getTop(14, 'casm');
}
playerPointsText.style.fontSize = Initialize.fontSize;
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
if (window.innerHeight/window.innerWidth > .55) {
    questionsText.style.top = getTop(7, "nbnbnb");
} else {
    questionsText.style.top = getTop(9.25);
}


questionsText.style.left = getLeft();
questionsText.style.fontSize = Initialize.fontSize;
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
if (window.innerHeight/window.innerWidth > .55) {
    levelText.style.top = getTop(9.25, "00");
} else {
    levelText.style.top = getTop(7);
}
// if (window.innerWidth-4/window.innerHeight-4 > .55) {
//     levelText.style.left = 10 + 'px';
// } else 
levelText.style.left = getLeft();
levelText.style.fontSize = Initialize.fontSize;
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
resultText.style.top = getTop(-28);
resultText.style.left = innerWidth / 2 + 'px';
resultText.style.fontSize = Initialize.fontSize;
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
resultPointsText.style.fontSize = Initialize.fontSize;
document.body.appendChild(resultPointsText);
let goalText = document.createElement('div');
goalText.className = 'hover';
goalText.style.position = 'absolute';
goalText.style.display = 'none';
goalText.style.backgroundColor = "green";
// goalText.style.backgroundColor = "rgb(f,f,f,.3)";
goalText.style.top = window.innerHeight / 2 + 'px';
goalText.style.left = innerWidth / 2 + 'px';
goalText.style.fontSize = Initialize.fontSize;
goalText.style.top = getTop(9.25);
// document.body.appendChild(goalText);
let progressBar = document.createElement('div');
progressBar.className = 'hover';
progressBar.style.display = 'none';
progressBar.style.position = 'absolute';
let progressBarBorder = document.createElement('div');
let highScore = document.createElement('div');
if (window.innerHeight/window.innerWidth > .55){
    progressBar.style.height = (window.innerWidth*.55)/40 + "px";
    progressBar.style.top = (window.innerWidth*.55) / 2 - (window.innerWidth*.55)/28 + 'px'; //+40
    progressBar.style.width = ((window.innerWidth*.55)/4.25) * (playerPoints/levels[level]) + "px";
    progressBarBorder.style.height = (window.innerWidth*.55)/40 + "px";
    progressBarBorder.style.width = ((window.innerWidth*.55)/4.5) + "px";
    highScore.style.top = (window.innerWidth - (window.innerWidth * .62)) + 'px';
} else {
    progressBar.style.height = window.innerHeight/40 + "px";
    progressBar.style.top = window.innerHeight / 2 - window.innerHeight/28 + 'px'; //+40
    progressBar.style.width = (window.innerHeight/4.25) * (playerPoints/levels[level]) + "px";
    progressBarBorder.style.height = window.innerHeight/40 + "px";
    progressBarBorder.style.width = (window.innerHeight/4.5) + "px";
    highScore.style.top = 0 + 'px';
}
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
highScore.style.fontSize = Initialize.fontSize;
document.body.appendChild(highScore);

const hideHTMLScoreboard = () => {
    playerPointsText.style.display = 'none';
    questionsText.style.display = 'none';
    levelText.style.display = 'none';
    resultText.style.display = 'none';
    goalText.style.display = 'none';
    progressBar.style.display = 'none';
    progressBarBorder.style.display = 'none';
    highScore.style.display = 'none';
}

export const restyleHTML = (offset) => {
    let left = offset;//window.innerHeight/57.5 + 'px';
    // else if (App.getGameState() == "after") left = window.innerWidth/2 + 'px';
    playerPointsText.style.position = 'absolute';
    playerPointsText.style.width = 100;
    playerPointsText.style.height = 100;
    playerPointsText.style.backgroundColor = "green";
    // playerPointsText.style.backgroundColor = "rgb(f,f,f,.3)";
    playerPointsText.style.top = getTop(9.25);//window.innerHeight / 2 - window.innerHeight/14 + 'px';
    playerPointsText.style.fontSize = Initialize.fontSize;
    playerPointsText.style.left = getLeft();
    questionsText.style.position = 'absolute';
    questionsText.style.width = 100;
    questionsText.style.height = 100;
    questionsText.style.backgroundColor = "green";
    // questionsText.style.backgroundColor = "rgb(f,f,f,.3)";
    questionsText.style.top = getTop(7);//window.innerHeight / 2 - window.innerHeight / 9.25 + 'px';
    questionsText.style.left = getLeft();
    questionsText.style.fontSize = Initialize.fontSize;
    levelText.style.position = 'absolute';
    levelText.style.width = 100;
    levelText.style.height = 100;
    levelText.style.backgroundColor = "green";
    // levelText.style.backgroundColor = "rgb(f,f,f,.3)";
    if (window.innerHeight/window.innerWidth > .55) {
        levelText.style.top = getTop(5);
    } else {
        levelText.style.top = window.innerHeight / 2 - window.innerHeight / 7 + 'px';
    }
    levelText.style.left = getLeft();
    levelText.style.fontSize = Initialize.fontSize;
    progressBar.style.height = window.innerHeight/40 + "px";
    progressBar.style.top = window.innerHeight / 2 - window.innerHeight/28 + 'px'; //+40
    progressBar.style.left = getLeft();//window.innerHeight/57.5 + 'px';
    progressBar.style.width = (window.innerHeight/4.25) * (playerPoints/levels[level]) + "px";
    progressBarBorder.style.height = window.innerHeight/40 + "px";
    progressBarBorder.style.top = window.innerHeight / 2 - window.innerHeight/28 + 'px'; //+40
    progressBarBorder.style.left = getLeft();//window.innerHeight/57.5 + 'px';
    progressBarBorder.style.width = (window.innerHeight/4.5) + "px";
    highScore.style.position = 'absolute';
    highScore.style.backgroundColor = "yellow";
    highScore.style.top = 0 + 'px';
    highScore.style.left = getLeft();
    highScore.style.fontSize = Initialize.fontSize;
    if (!resultText)
        resultText = document.createElement('div');
    resultText.style.position = 'absolute';
    resultText.style.width = 100;
    resultText.style.height = 100;
    resultText.style.backgroundColor = "yellow";
    resultText.style.top = window.innerHeight / 2 + window.innerHeight / 28 + 'px';
    if (App.getGameState() == 'game over')
        resultText.style.left = window.innerWidth / 2 + window.innerWidth/4 + 'px';
    else
        resultText.style.left = window.innerWidth / 2 + 'px';
    resultText.style.fontSize = Initialize.fontSize;
    if (!goalText)
        goalText = document.createElement('div');
    goalText.style.position = 'absolute';
    goalText.style.color = "green";
    goalText.style.top = window.innerHeight / 2 + 'px';
    if (App.getGameState() == 'game over')
        goalText.style.left = window.innerWidth / 2 + window.innerWidth/4 + 'px';
    else
        goalText.style.left = window.innerWidth / 2 + 'px';
    goalText.style.fontSize = Initialize.fontSize;
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
    resultPointsText.style.fontSize = Initialize.fontSize;
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
    if (questionsText2 != null) {
        scene.remove(questionsText2);
        scene.remove(levelText2);
        scene.remove(resultText2);
        scene.remove(goalText2);
        scene.remove(highScore2);
    }
    const fontJson = require( '../fonts/Arial_regular.json' );
    const font = new THREE.Font( fontJson );
    let fontInfo = {
        font: font,
        size: 70,
        height: 0,
        curveSegments: 2,
        bevelThickness: 1,
        bevelSize: 1,
        bevelEnabled: false
    };

    questionsText2 = new THREE.TextGeometry( "Question: " + currentQuestion + "/" + questions[level], fontInfo);
    levelText2 = new THREE.TextGeometry( "Level " + (level + 1) + ": Top " + numLocs[level] + " Cities", fontInfo);
    if (distanceFromPoint >= 100000) {
        resultText2 = new THREE.TextGeometry( "Result: Out of Time", fontInfo );
    } else {
        resultText2 = new THREE.TextGeometry( "Result: " + distanceFromPoint + " mi." , fontInfo);
    }
    resultPointsText2 = new THREE.TextGeometry(  "Points: " + resultPoints, fontInfo);
    goalText2 = new THREE.TextGeometry( "Question: " + currentQuestion + "/" + questions[level], fontInfo);
    highScore2 = new THREE.TextGeometry( "Highscore: " + App.checkCookie() + " Current: " + totalPoints, fontInfo);
    // currentCity = Locations.getLocationText(numLocs[level]);
    if (currentCity.secondary.length == 0) {
        locationText2 = new THREE.TextGeometry( currentCity.city, fontInfo);
        locationText3 = new THREE.TextGeometry( currentCity.secondary, fontInfo);
    } else {
        locationText2 = new THREE.TextGeometry( currentCity.city + ", " + currentCity.secondary, fontInfo);
        locationText3 = new THREE.TextGeometry( currentCity.country, fontInfo);
    }
    // var textGeometry = new THREE.TextGeometry( );
    // let meshes = [questionsText2, levelText2, resultText2, goalText2, highScore2];

    var textMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, specular: 0xffffff });
    getTextMesh(-2000, 100, questionsText2, new THREE.MeshBasicMaterial({ color: 0x009900, specular: 0xffffff }));
    getTextMesh(-2000, -100, resultText2, new THREE.MeshBasicMaterial({ color: 0xffff00, specular: 0xffffff }));
    getTextMesh(-2000, 0, levelText2, new THREE.MeshBasicMaterial({ color: 0x009900, specular: 0xffffff }));
    getTextMesh(0, 0, resultPointsText2, new THREE.MeshBasicMaterial({ color: 0xffff00, specular: 0xffffff }));
    getTextMesh(-2000, 1000, highScore2, new THREE.MeshBasicMaterial({ color: 0xffff00, specular: 0xffffff }));
    getTextMesh(-2000, 300, locationText2, new THREE.MeshBasicMaterial({ color: 0x0000ff, specular: 0xffffff }));
    getTextMesh(-2000, 200, locationText3, new THREE.MeshBasicMaterial({ color: 0x0000ff, specular: 0xffffff }));
}

const getTextMesh = (x, y, mesh, tm) => {
    mesh = new THREE.Mesh( mesh, tm );
    scene.add( mesh );
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.position.z = 4;
}

export const makeHTMLScoreboard = (distance) => {

    let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';
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

    if (App.getGameState() == 'after'){
        resultText.style.display = "inline-block";
        if (distanceFromPoint >= 100000) resultText.innerHTML = "Result: Out of Time";
        else resultText.innerHTML = "Result: " + distanceFromPoint + " mi.";
    } else if (resultText) resultText.style.display = "none";
    
    if (App.getGameState() == 'after'){
        resultPointsText.style.display = "inline-block";
        resultPointsText.innerHTML = "Points: " + resultPoints;
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
    console.log(result);
    // window.clearTimeout(myTimer);
    goalText.style.left = window.innerWidth / 2 + window.innerWidth/14 + 'px';
    resultPointsText.style.left = window.innerWidth / 2 + window.innerWidth/14 + 'px';
    resultText.style.left = window.innerWidth / 2 + window.innerWidth/14 + 'px';
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
    if (!menuButton) menuButton = Initialize.menuButton;
    menuButton.position.y = window.innerHeight/2 - 800;
    Initialize.scene.add(menuButton);
    if (!submitButton) submitButton = Initialize.submitButton;
    if (App.checkCookie() == totalPoints) Initialize.scene.add(submitButton);
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
    circle.scale.set(circle.scale.x + 40, circle.scale.y + 40, 1);
    scene.remove(circle3);
    let geometry = new THREE.RingGeometry( circle.scale.x-7, circle.scale.x, Math.round(distances[0]) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    circle3 = new THREE.Mesh( geometry, material );
    circle3.position.set(circle.position.x, circle.position.y, 1);
    scene.add(circle3);
    if (circle.scale.x >= distances[0]) {
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

const makeCircle = (distance, position) => {
    let tmp = new THREE.Vector3(position.x, position.y, 0);
    tmp = convertLatLongToWorldCoords(tmp);
    // convertToPixelCoords(tmp);
    let geometry = new THREE.CircleGeometry( 1, Math.round(distance) );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, opacity: 0.2, transparent: true } );
    circle = new THREE.Mesh( geometry, material );
    circle.position.set(tmp.x, tmp.y, 1);
    scene.add( circle );
    geometry = new THREE.CircleGeometry( 6, 8 );
    if (mapIndex[level] == 3)
        material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.FrontSide } );
    else
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide } );
    var circle2 = new THREE.Mesh( geometry, material );
    circle2.position.set(tmp.x, tmp.y, 1);
    scene.add( circle2 );
    geometry = new THREE.RingGeometry( 0, 2, Math.round(distance) );
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
export let currentCity;// = Locations.getRandomLocation();

const getMouseCoords = (event) => {
    mouse.clientX = event.clientX;
    mouse.clientY = event.clientY;
    if (window.innerHeight/window.innerWidth > .55) {
        mouse.clientY += (renderer.domElement.height - window.innerHeight) / 2;
        console.log(mouse.clientY, event.clientY);
    }
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


