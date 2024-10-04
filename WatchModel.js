/**
 * Class to group 3 couples of digital number
 */
import { Group, Mesh, MeshBasicMaterial, PlaneGeometry, CylinderGeometry, BoxGeometry } from '../build/three.module.js';
import TwoDigitalNumber from './TwoDigitalNumber.js';
import WatchButton from './WatchButton.js';
import {createText} from './jsm/webxr/Text2D.js';

export default class WatchModel {
  constructor( watchId, deltaGMT, hours, minutes, seconds, group, watchFace, hoursHandle, minutesHandle, secondsHandle ) {
	this.watchId = watchId;
	this.deltaGMT = deltaGMT;
    this.initNumbers();
    this.initDots();
	this.initWatchHandles();
	this.initWatchButtons();
	this.initWatchFace();
	this.deltaHours = 0;
	this.deltaMinutes = 0;
	this.lightButtonState = 0;
	this.modeButtonState = 0;
	this.ampmButtonState = 0;
	this.analogicButtonState = 0;
  }
	
  // updateTimeFunction()
  update() {
    const date = new Date();
		
	const milliseconds = date.getMilliseconds();
	const seconds = date.getSeconds();
	
	const minutes = date.getMinutes() + this.deltaMinutes;
	// Display minutes limited to 59
	if( minutes == 60 ) {
		this.deltaMinutes = this.deltaMinutes - 60;
		this.deltaHours++
	}
	
	let hours = 0;
	if( this.ampmButtonState == 0 ) {
		hours = date.getHours() + this.deltaHours + this.deltaGMT;
		// Display hours limited to 23
		if( hours == 24 ) this.deltaHours = this.deltaHours - 24;
    }
	else {
		// Get 12 hours time AM/PM format
		let completeTime = date.toLocaleTimeString("en-US", { hour12: true, hour: '2-digit', minute: '2-digit'});
		//console.log( completeTime );
		hours = parseInt(completeTime.match(/(\d+)/)) + this.deltaHours + this.deltaGMT;
		// Display hours limited to 12
		if( hours == 12 ) this.deltaHours = this.deltaHours - 12;
	}
	if( (this.modeButtonState == 1) && ( milliseconds < 500 )) {
	//if( (this.modeButtonState == 1) && (seconds%2 == 0 )) {
		//Blink hours every seconds
		this.hour.update(hours, true);
	} else this.hour.update(hours, false);
	
	if( (this.modeButtonState ==2) && ( milliseconds < 500 )) {
	//if( (this.modeButtonState ==2) && ( seconds%2 == 0 )) {
		//Blink minutes every seconds
		this.minutes.update(minutes, true);
	} else this.minutes.update(minutes, false);
    this.seconds.update(seconds);
	
	//Analogical watch part used overriden hours and minutes computed for digital clock
	//let hourAngle = date.getHours() / 12 * Math.PI * 2;
	let hourAngle = hours / 12 * Math.PI * 2;
	this.hoursHandle.rotation.z = -hourAngle;
	this.hoursHandle.position.set(Math.sin(hourAngle)*2, Math.cos(hourAngle)*2, 0);
	//let minuteAngle = date.getMinutes() / 60 * Math.PI * 2;
	let minuteAngle = minutes / 60 * Math.PI * 2;
	this.minutesHandle.rotation.z = -minuteAngle;
	this.minutesHandle.position.set(Math.sin(minuteAngle)*4, Math.cos(minuteAngle)*4, 0);
    let secondAngle = date.getSeconds() / 60 * Math.PI * 2;
    //let secondAngle = (date.getSeconds() + date.getMilliseconds() / 1000) / 60 * Math.PI * 2;
    this.secondsHandle.rotation.z = -secondAngle;
	this.secondsHandle.position.set(Math.sin(secondAngle)*4, Math.cos(secondAngle)*4, 0);
  }

  initNumbers() {
    this.hour = new TwoDigitalNumber();
    this.minutes = new TwoDigitalNumber();
    this.seconds = new TwoDigitalNumber();
    this.hour.group.position.set(-6, 0, 0);
    this.seconds.group.position.set(6, 0, 0);
    this.group = new Group();
    this.group.add(this.hour.group);
    this.group.add(this.minutes.group);
    this.group.add(this.seconds.group);
  }

   // Dots to separate hours, minutes and seconds
  initDots() {
    const dotGeometry = new PlaneGeometry(0.3, 0.3);
    const material = new MeshBasicMaterial({
	  color:0xff0000
    });
    const dot = new Mesh(dotGeometry, material);

    const dot1 = dot.clone();
    dot1.position.set(-3, 0.8, 0);
    const dot2 = dot.clone();
    dot2.position.set(-3, -0.8, 0);

    const dot3 = dot.clone();
    dot3.position.set(3, 0.8, 0);
    const dot4 = dot.clone();
    dot4.position.set(3, -0.8, 0);

    this.group.add(dot1, dot2, dot3, dot4);
  }
  
  initWatchButtons() {
	  const modeButton = new WatchButton( this.watchId, 'Mode',-10,0,0 );
	  this.group.add( modeButton.geometry );
	  
	  const increaseButton = new WatchButton( this.watchId, 'Increase',-8.4,5.2,0 );
	  this.group.add( increaseButton.geometry );
	  
	  const lightButton = new WatchButton( this.watchId, 'Light',0,-10,0 );
	  this.group.add( lightButton.geometry );
	  
	  const ampmButton = new WatchButton( this.watchId, 'AM/PM',10,0,0 );
	  this.group.add( ampmButton.geometry );
	  
	  const deleteButton = new WatchButton( this.watchId, 'Delete',0,10,0 );
	  this.group.add( deleteButton.geometry );
	  
	  const resetButton = new WatchButton( this.watchId, 'Reset',-8.4,-5.2,0 );
	  this.group.add( resetButton.geometry );
	  
	  const analogicButton = new WatchButton( this.watchId, 'Analogic',8.4,5.2,0 );
	  this.group.add( analogicButton.geometry );
	  
	  const dummy4Button = new WatchButton( this.watchId, '4',8.4,-5.2,0 );
	  this.group.add( dummy4Button.geometry );
	  
	  const dummy1Button = new WatchButton( this.watchId, '1',5.4,8.2,0 );
	  this.group.add( dummy1Button.geometry );
	  
	  const dummy5Button = new WatchButton( this.watchId, '5',5.2,-8.4,0 );
	  this.group.add( dummy5Button.geometry );
	  
	  const dummy7Button = new WatchButton( this.watchId, '7',-5.2,-8.4,0 );
	  this.group.add( dummy7Button.geometry );
	  
	  const dummy11Button = new WatchButton( this.watchId, '11',-5.2,8.4,0 );
	  this.group.add( dummy11Button.geometry );
  }
  
  onButtonClicked( buttonName ) {
	  console.log( buttonName, 'was clicked' );
	  
	  switch ( buttonName ) {
		case 'Light' :
			{		
				this.lightButtonState++;
				// Two states button
				if( this.lightButtonState == 2 ) this.lightButtonState = 0;
							
				if( this.lightButtonState == 0 ) {
					// White background
					this.setWatchFaceColor(0xffffff);
				}
				else {
					// Yellow background
					this.setWatchFaceColor(0xfbe106);
				}
				break;
			}
		case 'Mode' :
			{
				this.modeButtonState++;
				// Three states button
				if( this.modeButtonState == 3 ) this.modeButtonState = 0;
				break;
			}
		case 'Increase' :
			{
				if( this.modeButtonState == 1 ) {
					console.log( 'increase hours' );
					this.increaseHours();
				}
				else if( this.modeButtonState == 2 ) {
					console.log( 'increase minutes');
					this.increaseMinutes();
				}
				break;
			}
		case 'AM/PM' :
			{
				this.ampmButtonState++;
				// Two states button
				if( this.ampmButtonState == 2 ) this.ampmButtonState = 0;
		  
				if( this.ampmButtonState == 0 ) {
					console.log( 'display in 24 hours' );
				}
				else {
					console.log( 'display in 12 hours' );
				}
				break;
			}
		case 'Reset' :
			{
				this.deltaHours = 0;
				this.deltaMinutes = 0;
				break;
			}
		case 'Analogic' :
			{
				this.analogicButtonState++
				// Two states button
				if( this.analogicButtonState == 2 ) this.analogicButtonState = 0;
				
				if( this.analogicButtonState == 1 ) {
					// Hide components of digital clock
					for( let i = 0; i < 7; i++ ) {
					this.group.children[i].visible = false;
					}
					// Show components of analogic clock
					for( let i = 7; i < 10; i++ ) {
						this.group.children[i].visible = true;
					}
				}
				else {
					// Hide components of analogic clock
					for( let i = 7; i < 10; i++ ) {
						this.group.children[i].visible = false;
					}
					//Show components of digital clock
					for( let i = 0; i < 7; i++ ) {
					this.group.children[i].visible = true;
					}
				}
				break;
			}
		default :
			{
				console.log( buttonName, ' unknown button' );
			}
	  }
  }
   
  // Watch face ; white by default
  initWatchFace() {
	const cylinderGeometry = new CylinderGeometry( 11, 11, -1, 32 );
	// Give to the watch face the name of the watch
	cylinderGeometry.name = this.watchId + 'WatchFace';
	const cylinderMaterial = new MeshBasicMaterial( { color: 0xffffff,transparent:true,opacity:0.8});
	this.watchFace = new Mesh( cylinderGeometry, cylinderMaterial );
	this.watchFace.rotateX(Math.PI * 0.5);
	this.group.add(this.watchFace);
  }
  
  initWatchHandles() {
	this.hoursHandle = new Mesh(
		new BoxGeometry(0.5, 4, 0.1),
		new MeshBasicMaterial( { color: 0xff0000,transparent:true,opacity:0.8})
		);
	this.hoursHandle.position.set(0,0,0);
	this.hoursHandle.visible = false;
	this.group.add(this.hoursHandle);
	
	this.minutesHandle = new Mesh(
	// Width Height Depth 
	new BoxGeometry(0.4, 8, 0.1),
	new MeshBasicMaterial( { color: 0xff0000,transparent:true,opacity:0.8})
		);
	this.minutesHandle.position.set(0,0,0);
	this.minutesHandle.visible = false;
	this.group.add(this.minutesHandle);
	
	this.secondsHandle = new Mesh(
	// Width Height Depth 
	new BoxGeometry(0.2, 9, 0.1),
	new MeshBasicMaterial( { color: 0xff0000,transparent:true,opacity:0.8})
		);
	this.secondsHandle.position.set(0,0,0);
	this.secondsHandle.visible = false;
	this.group.add(this.secondsHandle);
  }
  
  setWatchFaceColor( color ) {
	  const material = new MeshBasicMaterial( { color: color,transparent:true,opacity:0.8});
	  this.watchFace.material = material;
  }
  
  increaseHours() {
	  this.hour.update(this.deltaHours++, false)
  }
  
  increaseMinutes() {
	  this.minutes.update(this.deltaMinutes++, false);
  }
}