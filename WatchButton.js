/**
 * Class to create a button on the clock
 */
import { Mesh, MeshBasicMaterial, CylinderGeometry, InstancedBufferAttribute } from '../build/three.module.js';
import {createText} from './jsm/webxr/Text2D.js';

export default class WatchButton {
  constructor( watchId, name, positionX, positionY, positionZ ) {
    this.init( watchId, name, positionX, positionY, positionZ );
  }

  init(watchId, name, positionX, positionY, positionZ ) {
	// Button geometry
	const buttonGeometry = new CylinderGeometry( 1,1,0,32);
	buttonGeometry.name = watchId+name;
	const buttonMaterial = new MeshBasicMaterial( { color : 0x123123 } );
	
	const button = new Mesh( buttonGeometry, buttonMaterial );
	button.rotateX(Math.PI * 0.5);
	button.position.set(positionX, positionY, positionZ);
	
	// Button text as mesh child of the button
	const buttonText = createText( name, 0.5 );
	button.add( buttonText );
	buttonText.rotation.x = - Math.PI / 2;
	buttonText.position.set( 0, 0.051, 0 );
	
	this.geometry = button;
  }
}