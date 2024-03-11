import * as THREE from 'three';
import { convertToPixelCoords, getTop } from "./gameStep.js";
import txt from "./cities.txt";
import * as Initialize from "./Initialize.js";

export let locations = [];

export const newLocation = (city, secondary, country, lat, long) => {
	let latLong = new THREE.Vector3(long, lat, 0);
	let pixelCoords = new THREE.Vector3(long, lat, 0);
	convertToPixelCoords(pixelCoords);
	lat = Math.round(100*lat)/100;
	long = Math.round(100*long)/100;
	let location = {
		lat,
		long,
		city,
		country,
		secondary,
		pixelCoords:pixelCoords,
		latLong: latLong
	}
	return location;
}

export const getLocations = () => {
	const splitLines = str => str.split(/\r?\n/);
	let lines = splitLines(txt);
	// let portland = newLocation("Portland", "Maine", "United States", 43.6591, -70.2568);
	// locations.push(portland);
	for (var i = 1; i < lines.length; i++) {
		let city = "";
		let lat = "";
		let long = "";
		let country = "";
		let line = lines[i];
		const arr = line.split(",");
		city += arr[0];
		lat = parseFloat(arr[2].replace("\"", ""));
		long = parseFloat(arr[3].replace("\"", ""));
		let country2 = arr[5].replace("\"", "");
		let secondary = arr[7].replace("\"", "");
		secondary = secondary.replace("\"", "");
		secondary.replace("	", " ");
		secondary = secondary.trim();
		let admin = arr[8].replace("\"", "");
		admin = admin.replace("\"", "");
		admin.replace("	", " ");
		admin = admin.trim();
		country2 = country2.replace("\"", "");
		country2 = country2.trim();
		country = arr[4].replace("	", " ");
		country = country.replace("\"", "");
		country = country.replace("\"", "");
		if (country2 == "South" || country2 == "North"){
			country = country2 + " " + country;
		}
		if (admin == "primary") secondary = '';
		if (city == secondary) secondary = '';
		locations.push(newLocation(city, secondary, country, lat, long));
	}
}

export let text2;

export const restyleHTMLLoc = (offset) => {
	text2.style.position = 'absolute';
	//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	text2.style.width = 100;
	text2.style.height = 100;
	text2.style.backgroundColor = "blue";
	text2.style.zIndex = 1;
	text2.style.color="white";
	if (window.innerHeight/window.innerWidth > .55) {
		text2.style.top = getTop(0);
		text2.style.fontSize = Initialize.fontSize;//window.innerHeight/40 + 'px';
		text2.style.left = '0px';//offset;//window.innerHeight/57.5 + 'px';
	} else {
		text2.style.top = window.innerHeight / 2 + 'px';
		text2.style.fontSize = window.innerHeight/40 + 'px';
		text2.style.left = offset;//window.innerHeight/57.5 + 'px';
	}
}

export const getRandomLocation = (num) => {
	if (window.innerHeight/window.innerWidth > .55) {
		return getLocationText(num);
	} else {
		return getHTMLLocation(num);
	}
}

export const getHTMLLocation = (num) => {
	let windowOffset = ((window.innerWidth) - (window.innerHeight - 4) * 2) / 2 + 'px';
	// let index = Math.floor(Math.random() * locations.length);  
	let index = Math.floor(Math.random() * num);  
	let loc = locations[index];
	if (!text2){
		text2 = document.createElement('div');
		//text2.className = 'hover';
		text2.style.position = 'absolute';
		text2.id='loc';
		text2.style.id='loc';
		//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
		text2.style.width = 100;
		text2.style.height = 100;
		// text2.style.color = 'black';
		text2.style.color = "white";
		text2.style.backgroundColor = "blue";
		if (window.innerHeight/window.innerWidth > .55) {
			text2.style.top = getTop(0);
			text2.style.fontSize = Initialize.fontSize;//window.innerHeight/40 + 'px';
			text2.style.left = '0px';//offset;//window.innerHeight/57.5 + 'px';
		} else {
			text2.style.top = window.innerHeight / 2 + 'px';
			text2.style.fontSize = window.innerHeight/40 + 'px';
			text2.style.left = windowOffset;//window.innerHeight/57.5 + 'px';
		}
		// text2.style.top = window.innerHeight / 2 + 'px';
		// text2.style.fontSize = window.innerHeight/40 + 'px';
	 //    text2.style.left = windowOffset;// window.innerHeight/57.5 + 'px';
		document.body.appendChild(text2);
	}
	text2.style.display = 'inline-block';
	if (loc.city == loc.secondary || loc.secondary.length == 0){
		text2.innerHTML = "Target: " + loc.city + ", " + loc.country;
	} else {
		text2.innerHTML = "Target: " + loc.city + ", " + loc.secondary + ", " + loc.country;
	}
	return loc;
}

export const getLocationText = (num) => {
	let index = Math.floor(Math.random() * num);  
	let loc = locations[index];
	// if (loc.city == loc.secondary || loc.secondary.length == 0){
	return loc;
}

