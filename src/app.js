import * as THREE from 'three';
import { init, load, scene, renderer, camera, updateLoaderBar, textureLoadingProgress, startButton, 
	removeLoaderBar, title, titleTex, highscoresButton} from "./physics/Initialize.js";
import {makeHTMLScoreboard, showScore, updateCircleRadius, setButtons} from "./physics/gameStep.js";
import 'normalize.css';
import './styles/styles.scss';
import * as crypto from 'crypto-js';
import {key, email, password} from './physics/key.js';
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var firebaseConfig = {
	apiKey: "AIzaSyB-6vBUk8IjAgZVpCr1aXswyUmc8f2qOjc",
	authDomain: "spherejaunters.firebaseapp.com",
	databaseURL: "https://spherejaunters.firebaseio.com",
	projectId: "spherejaunters",
	storageBucket: "spherejaunters.appspot.com",
	messagingSenderId: "294014518293",
	appId: "1:294014518293:web:ef02025192f75c22e1fa1c",
	measurementId: "G-97V8WQRXR2"
};

firebase.initializeApp(firebaseConfig);

let database = firebase.database();

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  console.log(errorCode, errorMessage);
  // ...
});

console.log(firebase);

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function setCookie(cname, cvalue, exdays) {
    let encHighScore = crypto.AES.encrypt(cvalue + "", key);
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + encHighScore + ";" + expires + ";path=/";
}

export let highscore = 0;

// export const setHighscore = (score) => {
//     highscore = score;
// }

export function checkCookie() {
    let hs = getCookie("data");
    if (!hs) {
      setCookie("data", 0, 365);
      return 0;
    } else {
        let decrypted = crypto.AES.decrypt(hs, key).toString(crypto.enc.Utf8);
        highscore = decrypted;
        return highscore;
    } 

}

checkCookie();

export const submitScore = (name, score) => {
    if (name.length > 0){
        let date = new Date().getTime();
        let now = new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear();
        // let now = date.toUTCString();
        let firebaseRef = database.ref('scores/');
        firebaseRef.push().set({
            name, 
            date: now,
            score
        });
    }
}


export let scoreboard;
let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';  

export const getScores = () => {
    let scores = [];
    let ref = database.ref("scores");
    ref.orderByChild("score").limitToLast(10).on("child_added", function(snapshot) {
        scores.push(snapshot);
    });
    scores = sortByScore(scores);
    if (scoreboard) document.body.removeChild(document.getElementById('scoreboard'));
    scoreboard = document.createElement('table');
    scoreboard.style.position = 'absolute';
    scoreboard.style.overflow = 'hidden';
    scoreboard.style.color = '#fff';
    scoreboard.style.backgroundColor = '#111';
    scoreboard.style.top = window.innerHeight / 25 + 'px';
    scoreboard.style.height = window.innerHeight * 0.65 + 'px';
    scoreboard.style.width = (window.innerHeight - 4) * 1.5 + 'px';
    scoreboard.style.left = windowOffset;
    scoreboard.id = 'scoreboard';
    document.body.appendChild(scoreboard);
    let header = document.createElement('caption');
    header.id = 'scoreHeader';
    header.style.backgroundColor = '#111';
    header.style.textAlign = 'left';
    header.innerHTML = "Highscores";
    header.style.fontSize = window.innerHeight / 15 + 'px';
    scoreboard.appendChild(header);
    scoreboard.fontSize = window.innerHeight / 30 + 'px';
    let tableHeaderRow = document.createElement('tr');
    tableHeaderRow.className = 'scoreRow';
    let rankH = document.createElement('th');
    let nameH = document.createElement('th');
    let scoreH = document.createElement('th');
    let dateH = document.createElement('th');
    rankH.className = 'scoreItem';
    nameH.className = 'scoreItem';
    scoreH.className = 'scoreItem';
    dateH.className = 'scoreItem';
    rankH.innerHTML = 'Rank';
    nameH.innerHTML = 'Name';
    scoreH.innerHTML = 'Score';
    dateH.innerHTML = 'Date';
    scoreboard.appendChild(tableHeaderRow);
    tableHeaderRow.appendChild(rankH);
    tableHeaderRow.appendChild(nameH);
    tableHeaderRow.appendChild(scoreH);
    tableHeaderRow.appendChild(dateH);
    for (var i = 0; i < scores.length; i++) {
        let scoreRow = document.createElement('tr');
        scoreRow.className = 'scoreRow';
        let rank = document.createElement('td');
        let name = document.createElement('td');
        let score = document.createElement('td');
        let date = document.createElement('td');
        rank.className = 'scoreItem';
        name.className = 'scoreItem';
        score.className = 'scoreItem';
        date.className = 'scoreItem';
        rank.innerHTML = i+1;
        name.innerHTML = scores[i].val().name;
        score.innerHTML = scores[i].val().score;
        date.innerHTML = scores[i].val().date;
        scoreboard.appendChild(scoreRow);
        scoreRow.appendChild(rank);
        scoreRow.appendChild(name);
        scoreRow.appendChild(score);
        scoreRow.appendChild(date);
    }

}

const fadeAudio = () => {

}

const hideScores = () => {
    scoreboard.style.display = 'none';
}

getScores();
hideScores();

function sortByScore(array) {
    return array.sort(function(a, b) {
        let x = a.val().score; let y = b.val().score;
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
}

let gameState = "loading";
export const getGameState = () => {
	return gameState;
}

export const setGameState = (s) => {
	gameState = s;
}

load();

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

export let timerBar;
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
	if (getGameState() == 'loading') {
		updateLoaderBar();
		console.log(textureLoadingProgress);
		if (textureLoadingProgress >= 19) {
			removeLoaderBar();
			setGameState('loading done');
			init();
			setButtons();
			scene.add(startButton);
			scene.add(highscoresButton);
			title.position.y = 550;
			title.position.z = 5;
			scene.add(title);
		}
	}
	if (gameState != "loading" && gameState != "loading done"){
		let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';  

	    if (!timerBar){
	        timerBar = document.createElement('div');
	        timerBar.style.position = 'absolute';
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
	        timerBarBar.style.width = 125 + "px";
	        timerBarBar.style.height = window.innerHeight/40 + "px";
	        timerBarBar.style.backgroundColor = "#f00";
	        timerBarBar.style.top = window.innerHeight / 2 + window.innerHeight/14 + 'px'; //+40
	        timerBarBar.style.left = windowOffset;// window.innerHeight/57.5 + 'px';
	        document.body.appendChild(timerBarBar);
	    }
	    if (getGameState() == 'during' || getGameState() == 'after'){
	        timerBar.style.display = 'inline-block';
	    	timerBarBar.style.display = 'inline-block';
	    } else {
	    	timerBar.style.display = 'none';
	    	timerBarBar.style.display = 'none';
	    }
	    if (getGameState() == "during"){
	    	currentTime = new Date().getTime();
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