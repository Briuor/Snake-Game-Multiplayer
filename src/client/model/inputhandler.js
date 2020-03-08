export default class inputHandler {
	constructor() {
		this.direction = {};
		this.initKeyboardEvents();
	}

	initKeyboardEvents() {
		window.addEventListener('keydown', (e) => {
			switch(e.keyCode) {
				case 38: 
					this.direction = 'top';
					break;
				case 39: 
					this.direction = 'right';
					break;
				case 40: 
					this.direction = 'down';
					break;
				case 37: 
					this.direction = 'left';
					break;
				case 32:
					this.direction = 'stop';
					break;
			}
		});
	}

}