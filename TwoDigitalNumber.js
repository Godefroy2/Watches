/**
 * Class to create two digits number
 */
import { Group } from '../build/three.module.js';
import DigitalNumber from './digitalNumber.js';

export default class TwoDigitalNumber {
  constructor( first, second, group ) {
    this.init();
    this.update(0);
  }

  init() {
    this.first = new DigitalNumber();
    this.second = new DigitalNumber();
    this.first.group.position.set(-1.2, 0, 0);
    this.second.group.position.set(1.2, 0, 0);
    this.group = new Group();
    this.group.add(this.first.group);
    this.group.add(this.second.group);
  }

  update(number, blink) {
    if (number >= 100) {
      throw new Error("number should less than 100");
    } else if( blink == true ) {
		// 10 to dispplay noting in case of blink
		this.first.number = 10;
		this.second.number = 10;
	} else {
      const firstNumber = Math.floor(number / 10);
      const secondNumber = Math.floor(number % 10);
      this.first.number = firstNumber;
      this.second.number = secondNumber;
    }
  }
}